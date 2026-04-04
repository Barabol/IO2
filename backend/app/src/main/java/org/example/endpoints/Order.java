package org.example.endpoints;

import org.example.etc.DatabaseObjects.OrderRequest;
import org.example.etc.DatabaseObjects.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

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
		Integer cupon_id = null;
		if (order.cupon != null) {
			try {
				cupon_id = jdbcTemplate.queryForObject(
						"SELECT id FROM cupons WHERE name = ? AND uses > 0 AND time_of_life > NOW() LIMIT 1;", Integer.class,
						order.cupon.toUpperCase());
			} catch (EmptyResultDataAccessException e) {
				cupon_id = null;
			}
		}
		return "OK";
	}
}
