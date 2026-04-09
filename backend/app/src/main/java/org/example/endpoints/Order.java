package org.example.endpoints;

import org.example.etc.DatabaseObjects.Cupon;
import org.example.etc.DatabaseObjects.CuponRowMapper;
import org.example.etc.DatabaseObjects.Drink;
import org.example.etc.DatabaseObjects.OrderRequest;
import org.example.etc.DatabaseObjects.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.util.List;

import org.example.etc.AppProperties;
import org.example.etc.AppProperties.DictionaryField;

/**
 * Order
 */
@RestController
@RequestMapping("/order")
public class Order {
	@Autowired
	JdbcTemplate jdbcTemplate;

	@PostMapping("/new")
	public String newOrder(HttpSession session, HttpServletResponse response,
			@Validated @RequestBody(required = true) OrderRequest order) {
		UserInfo info = UserInfo.getFromSession(session, jdbcTemplate);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "you must be logged in to create an order";
		}
		Cupon cupon = null;
		if (order.cupon != null) {
			try {
				cupon = jdbcTemplate.queryForObject(
						"SELECT * FROM cupons WHERE name = ? AND uses > 0 AND time_of_life > NOW() LIMIT 1;",
						new CuponRowMapper(),
						order.cupon.toUpperCase());
			} catch (EmptyResultDataAccessException e) {
				// NOTE: can be changed to -> cupon_id = null;
				response.setStatus(HttpStatus.BAD_REQUEST.value());
				return "bad cupon";
			}
		}

		int total = 0;
		AppProperties properties = AppProperties.getProperties(jdbcTemplate);

		for (int x = 0; x < order.drinks.size(); x++) {
			Integer holder = properties.getDrinkPrice(order.drinks.get(x));
			if (holder == null) {
				response.setStatus(HttpStatus.BAD_REQUEST.value());
				return "Bad drink id";
			}
			total += holder;
		}

		for (int x = 0; x < order.pizzas.size(); x++) {
			Integer holder = properties.getPizzaPrice(order.pizzas.get(x));
			if (holder == null) {
				response.setStatus(HttpStatus.BAD_REQUEST.value());
				return "Bad pizza id";
			}
			total += holder;
		}
		// TODO: dodać wsparcie na modyfikowane pizz'e

		if (cupon != null) {
			if (total >= cupon.minimal_total) {
				if (cupon.discount_type != 1)
					total -= cupon.discount;
				else
					total -= total * cupon.discount / 100;
			} else {
				response.setStatus(HttpStatus.BAD_REQUEST.value());
				return "not eligible for cupon discount";
				// NOTE: can be changed to -> cupon_id = null;
			}
		}

		int adress_id = jdbcTemplate.queryForObject(
				"INSERT INTO delivery_adress(adress) VALUES (?) ON CONFLICT(adress) DO UPDATE SET adress = EXCLUDED.adress RETURNING id;",
				int.class, order.address);
		int order_id = jdbcTemplate.queryForObject("INSERT INTO orders" +
				"(user_id,order_time,delivery_time,total,status_id,delivery_method_id,payment_method_id,delivery_adress_id,cupon_id)"
				+ " VALUES (?,NOW(),null,?,0,?,?,?,?) RETURNING id;", int.class,
				info.id, total, order.delivery_method, order.payment_method, adress_id,
				cupon == null ? null : cupon.id);

		for (int x = 0; x < order.drinks.size(); x++) {
			jdbcTemplate.update("INSERT INTO ordered_drink(order_id,drink_id) VALUES (?, ?);",
					order_id, order.drinks.get(x));
		}
		for (int x = 0; x < order.pizzas.size(); x++) {
			jdbcTemplate.update("INSERT INTO ordered_pizza(order_id,pizza_id) VALUES (?, ?);",
					order_id, order.pizzas.get(x));
		}
		if (cupon != null)
			jdbcTemplate.update("UPDATE cupons SET uses = uses - 1 WHERE id = ?;", cupon.id);
		return "OK";
	}

	@GetMapping("/deliveryMethods")
	public List<DictionaryField> getDeliveryMethods() {
		return AppProperties.getProperties(jdbcTemplate).deliveryMethods;
	}

	@GetMapping("/statusNames")
	public List<DictionaryField> getStatusNames() {
		return AppProperties.getProperties(jdbcTemplate).orderStatus;
	}

	@GetMapping("/paymentMethods")
	public List<DictionaryField> getPaymentMethods() {
		return AppProperties.getProperties(jdbcTemplate).paymentMethods;
	}
}
