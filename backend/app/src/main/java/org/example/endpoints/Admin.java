package org.example.endpoints;

import java.util.List;

import org.example.etc.AppProperties;
import org.example.etc.RegexDefinitions;
import org.example.etc.DatabaseObjects.Cupon;
import org.example.etc.DatabaseObjects.Drink;
import org.example.etc.DatabaseObjects.Ingredient;
import org.example.etc.DatabaseObjects.NewPizza;
import org.example.etc.DatabaseObjects.OrderObject;
import org.example.etc.DatabaseObjects.Pizza;
import org.example.etc.DatabaseObjects.UserInfo;
import org.example.etc.DatabaseObjects.UserInfoRowMapper;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/**
 * Admin
 */
@RestController
@RequestMapping("/admin")
public class Admin {
	@Autowired
	JdbcTemplate jdbcTemplate;

	// NOTE: selecty | note

	@GetMapping("/all/users")
	public @ResponseBody List<UserInfo> getUsers(HttpSession session, HttpServletResponse response) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return null;
		}
		List<UserInfo> items = jdbcTemplate.query("SELECT * FROM users", new UserInfoRowMapper());
		for (UserInfo item : items) {
			item.password = "unavailable";
		}
		return items;
	}

	@GetMapping("/all/pizzas")
	public @ResponseBody List<Pizza> getPizzas(HttpSession session, HttpServletResponse response) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return null;
		}
		List<Pizza> items = Pizza.getAllPizzas(jdbcTemplate);
		return items;
	}

	@GetMapping("/all/drinks")
	public @ResponseBody List<Drink> getDrinks(HttpSession session, HttpServletResponse response) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return null;
		}
		List<Drink> items = Drink.getAllDrinks(jdbcTemplate);
		return items;
	}

	@GetMapping("/all/ingredients")
	public @ResponseBody List<Ingredient> getIngredients(HttpSession session, HttpServletResponse response) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return null;
		}
		List<Ingredient> items = Ingredient.getAllIngredients(jdbcTemplate);
		return items;
	}

	@GetMapping("/all/cupons")
	public @ResponseBody List<Cupon> getCupons(HttpSession session, HttpServletResponse response) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return null;
		}
		List<Cupon> items = Cupon.getAllCupons(jdbcTemplate);
		return items;
	}

	@GetMapping("/all/orders")
	public @ResponseBody List<OrderObject> getOrders(HttpSession session, HttpServletResponse response) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return null;
		}
		List<OrderObject> items = OrderObject.getAllPizzas(jdbcTemplate);
		return items;
	}

	// NOTE: dodawanie | done

	@PostMapping("add/newUser")
	public String addNewUser(HttpSession session, HttpServletResponse response,
			@Validated @RequestBody UserInfo user) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		RegexDefinitions re = RegexDefinitions.getRegex();
		if (!user.name.matches(re.name) || !user.surname.matches(re.surname) || !user.password.matches(re.password)) {
			response.setStatus(HttpStatus.BAD_REQUEST.value());
			return "bad user data";
		}
		String hash = BCrypt.hashpw(user.password, BCrypt.gensalt());
		this.jdbcTemplate.update("INSERT INTO users(name,surname,email,password,account_type_id) VALUES (?,?,?,?,?);",
				user.name, user.surname, user.email, hash, user.account_type);
		return "OK";
	}

	@PostMapping("add/cupon")
	public String addCupon(HttpSession session, HttpServletResponse response,
			@Validated @RequestBody Cupon cupon) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		RegexDefinitions re = RegexDefinitions.getRegex();
		if (!cupon.name.matches(re.cuponName)) {
			response.setStatus(HttpStatus.BAD_REQUEST.value());
			return "bad cupon name";
		}
		this.jdbcTemplate.update("INSERT INTO cupons(name,minimal_total,discount,discount_type_id,uses,time_of_life) " +
				"VALUES (?,?,?,?,?,?);",
				cupon.name.toUpperCase(), cupon.minimal_total, cupon.discount, cupon.discount_type, cupon.uses,
				cupon.time_of_life);

		return "OK";
	}

	@PostMapping("add/pizza")
	public String addPizza(HttpSession session, HttpServletResponse response,
			@Validated @RequestBody NewPizza pizza) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		if (!pizza.validate(jdbcTemplate)) {
			response.setStatus(HttpStatus.BAD_REQUEST.value());
			return "there is ingredient that does not exist";
		}
		int id;
		try {
			id = jdbcTemplate.queryForObject(
					"INSERT INTO pizzas(name,price,listed) VALUES (?,?,?) RETURNING id;",
					int.class, pizza.name, pizza.price, pizza.listed);
		} catch (DataIntegrityViolationException e) {
			response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
			return "unable to add pizza due to internal server error";
		}
		for (int x = 0; x < pizza.ingredients.size(); x++) {
			jdbcTemplate.update("INSERT INTO contents(pizza_id,ingredient_id) VALUES (?,?);", id,
					pizza.ingredients.get(x));
		}

		return "OK";
	}

	@PostMapping("add/drink")
	public String addDrink(HttpSession session, HttpServletResponse response,
			@Validated @RequestBody Drink drink) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		this.jdbcTemplate.update("INSERT INTO drinks(name,price,listed) VALUES (?,?,?);",
				drink.name, drink.price, drink.listed);
		return "OK";
	}

	@PostMapping("add/ingredient")
	public String addIngredient(HttpSession session, HttpServletResponse response,
			@Validated @RequestBody Ingredient ingredient) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		this.jdbcTemplate.update("INSERT INTO ingredients(name,price,listed) VALUES (?,?,?);",
				ingredient.name,
				ingredient.price,
				ingredient.listed);
		return "OK";
	}

	@PostMapping("add/ingredientToPizza")
	public String addIngredientToPizza(HttpSession session, HttpServletResponse response,
			@Validated @RequestBody @RequestParam(required = true) int pizza_id,
			@RequestParam(required = true) int ingredient_id) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		this.jdbcTemplate.update("INSERT INTO contents(pizza_id,ingredient_id) VALUES (?,?);",
				pizza_id, ingredient_id);
		return "OK";
	}

	// NOTE: usuwanie | done

	@DeleteMapping("remove/drink")
	public String removeDrink(HttpSession session, HttpServletResponse response,
			@RequestParam(required = true) int id) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		jdbcTemplate.update("DELETE FROM drinks WHERE id = ?", id);
		return "OK";
	}

	@DeleteMapping("remove/ingredient")
	public String removeIngredient(HttpSession session, HttpServletResponse response,
			@RequestParam(required = true) int id) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		jdbcTemplate.update("DELETE FROM contents WHERE ingredient_id = ?", id);
		jdbcTemplate.update("DELETE FROM ingredients WHERE id = ?", id);
		return "OK";
	}

	@DeleteMapping("remove/ingredientFromPizza")
	public String removeIngredientFromPizza(HttpSession session, HttpServletResponse response,
			@RequestParam(required = true) int pizza_id,
			@RequestParam(required = true) int ingredient_id) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		jdbcTemplate.update("DELETE FROM contents WHERE ingredient_id = ? AND pizza_id = ?",
				ingredient_id, pizza_id);
		return "OK";
	}

	@DeleteMapping("remove/pizza")
	public String removePizza(HttpSession session, HttpServletResponse response,
			@RequestParam(required = true) int id) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		jdbcTemplate.update("DELETE FROM contents WHERE pizza_id = ?", id);
		jdbcTemplate.update("DELETE FROM pizzas WHERE id = ?", id);
		return "OK";
	}

	// NOTE: changes

	public static class AccountTypeChange {
		public int user_id;
		public int account_type_id;
	}

	@PostMapping("change/account/type")
	public String changeAccountType(HttpSession session, HttpServletResponse response,
			@Validated @RequestBody(required = true) AccountTypeChange change) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		jdbcTemplate.update("UPDATE users SET account_type_id = ? WHERE id = ?;",
				change.account_type_id, change.user_id);
		return "OK";
	}

	@PostMapping("change/pizza/price")
	public String changePizzaPrice(HttpSession session, HttpServletResponse response,
			@RequestParam(required = true) Integer pizza_id, @RequestParam(required = true) Integer price) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		jdbcTemplate.update("UPDATE pizzas SET price = ? WHERE id = ?;",
				price, pizza_id);
		return "OK";
	}

	@PostMapping("change/drink/price")
	public String changeDrinkPrice(HttpSession session, HttpServletResponse response,
			@RequestParam(required = true) Integer drink_id, @RequestParam(required = true) Integer price) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		jdbcTemplate.update("UPDATE drinks SET price = ? WHERE id = ?;",
				price, drink_id);
		return "OK";
	}

	@PostMapping("change/ingredient/price")
	public String changeIngredientPrice(HttpSession session, HttpServletResponse response,
			@RequestParam(required = true) Integer ingredient_id, @RequestParam(required = true) Integer price) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		jdbcTemplate.update("UPDATE ingredients SET price = ? WHERE id = ?;",
				price, ingredient_id);
		return "OK";
	}

	@PostMapping("change/pizza/toggleListed")
	public String changePizzaToggleListed(HttpSession session, HttpServletResponse response,
			@RequestParam(required = true) Integer pizza_id) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		jdbcTemplate.update("UPDATE pizzas SET listed = NOT listed WHERE id = ?;",
				pizza_id);
		return "OK";
	}

	@PostMapping("change/drink/toggleListed")
	public String changeDrinkToggleListed(HttpSession session, HttpServletResponse response,
			@RequestParam(required = true) Integer drink_id) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		jdbcTemplate.update("UPDATE drinks SET listed = NOT listed WHERE id = ?;",
				drink_id);
		return "OK";
	}

	@PostMapping("change/ingredient/toggleListed")
	public String changeIngredientToggleListed(HttpSession session, HttpServletResponse response,
			@RequestParam(required = true) Integer ingredient_id) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		jdbcTemplate.update("UPDATE ingredients SET listed = NOT listed WHERE id = ?;",
				ingredient_id);
		return "OK";
	}

	// NOTE: other

	@GetMapping("/reload/properties")
	public String reloadProperties(HttpSession session, HttpServletResponse response) {
		UserInfo info = UserInfo.cheackUserPermision(session, jdbcTemplate, UserInfo.AccountTypes.ADMIN);
		if (info == null) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			return "unauthorized";
		}
		AppProperties app = AppProperties.getProperties();
		app.reload(jdbcTemplate);
		// TODO: dokończyć dodawanie nowego zamówienia
		return "OK";
	}
}
