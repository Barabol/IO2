package org.example.etc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

import org.example.etc.DatabaseObjects.UserInfo.AccountTypes;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/**
 * DatabaseObjects
 */
public class DatabaseObjects {

	public static class Cupon {
		@JsonIgnoreProperties(ignoreUnknown = true)
		public int id;
		public String name;
		public int minimal_total;
		public int discount;
		public int discount_type;
		public int uses;
		public Date time_of_life;

		public static List<Cupon> getAllCupons(JdbcTemplate db) {
			List<Cupon> ret = db.query("SELECT * FROM cupons;", new CuponRowMapper());
			return ret;
		}
	}

	public static class CuponRowMapper implements RowMapper<Cupon> {
		@Override
		public Cupon mapRow(ResultSet rs, int rowNum) throws SQLException {
			Cupon cupon = new Cupon();
			cupon.id = rs.getInt("id");
			cupon.name = rs.getString("name");
			cupon.minimal_total = rs.getInt("minimal_total");
			cupon.discount = rs.getInt("discount");
			cupon.discount_type = rs.getInt("discount_type_id");
			cupon.uses = rs.getInt("uses");
			cupon.time_of_life = rs.getDate("time_of_life");
			return cupon;
		}
	}

	public static class NewPizza {
		public String name;
		public int price;
		public boolean listed;
		public List<Integer> ingredients;

		public boolean validate(JdbcTemplate db) {
			List<Ingredient> allIngredients = Ingredient.getAllIngredients(db);
			boolean removed = false;
			for (Integer ingredient : ingredients) {
				removed = false;
				for (int x = 0; x < allIngredients.size(); x++) {
					if (allIngredients.get(x).id == ingredient) {
						allIngredients.remove(x);
						removed = true;
						break;
					}
					if (!removed)
						return false;
				}
			}
			return true;
		}
	}

	public static class UserInfo {
		public Integer id;
		public String name;
		public String surname;
		public String email;
		public int account_type;
		public String password;

		public static enum AccountTypes {
			USER(0),
			COOKER(1),
			KLERK(2),
			DELIVERER(3),
			UNACTIVATED(4),
			DEACTIVATED(5),
			ADMIN(6);

			private final int value;

			AccountTypes(int i) {
				this.value = i;
			}

			public int value() {
				return this.value;
			}

			public boolean equals(int i) {
				return this.value == i;
			}
		}

		@Override
		public String toString() {
			return "{" + id + "|" + name + "|" + surname + "|" + password + "|" + email + "|" + account_type + "}";
		}

		public static UserInfo getFromSession(HttpSession session, JdbcTemplate db) {
			UserInfo info = new UserInfo();
			try {
				info = db.queryForObject(
						"SELECT * FROM users WHERE id = ?",
						new UserInfoRowMapper(), (int) session.getAttribute("userId"));
			} catch (EmptyResultDataAccessException e) {
				return null;
			} catch (NullPointerException e) {
				return null;
			}
			return info;
		}

		public static UserInfo cheackUserPermision(HttpSession session, JdbcTemplate db, AccountTypes type) {
			UserInfo info = getFromSession(session, db);
			if (info == null)
				return null;
			if (type.equals(info.account_type))
				return info;
			return null;
		}
	}

	public static class UserInfoRowMapper implements RowMapper<UserInfo> {
		@Override
		public UserInfo mapRow(ResultSet rs, int rowNum) throws SQLException {
			UserInfo info = new UserInfo();
			info.id = rs.getInt("id");
			info.name = rs.getString("name");
			info.surname = rs.getString("surname");
			info.email = rs.getString("email");
			info.password = rs.getString("password");
			info.account_type = rs.getInt("account_type_id");
			return info;
		}
	}

	public static class AccountType {
		public String name;
		public int id;
	}

	public static class AccountTypeRowMapper implements RowMapper<AccountType> {
		@Override
		public AccountType mapRow(ResultSet rs, int rowNum) throws SQLException {
			AccountType permision = new AccountType();
			permision.name = rs.getString("name");
			permision.id = rs.getInt("id");
			return permision;
		}
	}

	public static class UserCreation {
		public String name;
		public String surname;
		public String email;
		public String password;

		public boolean validate() {
			if (name == null || surname == null || email == null || password == null)
				return false;

			RegexDefinitions re = RegexDefinitions.getRegex();
			return (this.password.matches(re.password) &&
					this.name.matches(re.name) &&
					this.surname.matches(re.surname) &&
					this.email.matches(re.email));
		}

		public String createUser(HttpSession session, HttpServletResponse response, JdbcTemplate db) {
			if (!this.validate()) {
				response.setStatus(HttpStatus.BAD_REQUEST.value());
				return "invalid request body";
			}
			String hash = BCrypt.hashpw(this.password, BCrypt.gensalt());
			int id;
			try {
				id = db.queryForObject(
						"INSERT INTO users(name,surname,email,password,account_type_id) VALUES (?,?,?,?,?) RETURNING id;",
						int.class, this.name,
						this.surname, this.email, hash, 0);
			} catch (DataIntegrityViolationException e) {
				response.setStatus(HttpStatus.BAD_REQUEST.value());
				return "unable to add new user due to e-mail being used by other accoiunt";
			}
			UserInfo info = new UserInfo();
			info.id = id;
			info.password = hash;
			info.email = this.email;
			info.name = this.name;
			info.surname = this.surname;
			session.setAttribute("userId", info.id);
			return "OK";
		}
	}

	public static class UserCredentials {
		public String email;
		public String password;

		public String loggin(HttpSession session, HttpServletResponse response, HttpServletRequest request,
				JdbcTemplate db) {
			UserInfo info = UserInfo.getFromSession(session, db);
			if (info != null)
				if (info.email.equals(this.email))
					return "OK";
				else {
					session.invalidate();
					session = request.getSession(true);
				}
			try {
				info = db.queryForObject(
						"SELECT * FROM users WHERE email = ?",
						new UserInfoRowMapper(), this.email);
			} catch (EmptyResultDataAccessException e) {
				response.setStatus(HttpStatus.BAD_REQUEST.value());
				return "bad email or password";
			}
			if (AccountTypes.UNACTIVATED.equals(info.account_type)) {
				response.setStatus(HttpStatus.UNAUTHORIZED.value());
				return "this account is unactivated";
			} else if (AccountTypes.DEACTIVATED.equals(info.account_type)) {
				response.setStatus(HttpStatus.UNAUTHORIZED.value());
				return "this account is deactivated";
			}
			if (!BCrypt.checkpw(this.password, info.password)) {
				response.setStatus(HttpStatus.BAD_REQUEST.value());
				return "bad email or password";
			}
			session.setAttribute("userId", info.id);
			return "OK";
		}
	}

	public static class PasswordChange {
		public String old_password;
		public String new_password;

		public String changePassword(HttpSession session, HttpServletResponse response, JdbcTemplate db) {
			UserInfo info = UserInfo.getFromSession(session, db);
			if (info == null) {
				response.setStatus(HttpStatus.UNAUTHORIZED.value());
				return "unouthorized";
			}
			RegexDefinitions re = RegexDefinitions.getRegex();
			if (!this.new_password.matches(re.password) || !this.old_password.matches(re.password)) {
				response.setStatus(HttpStatus.BAD_REQUEST.value());
				return "bad password";
			}
			if (this.new_password.equals(this.old_password)) {
				response.setStatus(HttpStatus.BAD_REQUEST.value());
				return "password must be diffrent";
			}
			if (!BCrypt.checkpw(this.old_password, info.password)) {
				response.setStatus(HttpStatus.BAD_REQUEST.value());
				return "bad password";
			}
			String hash = BCrypt.hashpw(this.new_password, BCrypt.gensalt());
			db.update("UPDATE users SET password = ? WHERE id = ?;", hash, info.id);
			return "OK";
		}
	}

	public static class Ingredient {
		public String name;
		public int price;
		public boolean listed;
		@JsonIgnoreProperties(ignoreUnknown = true)
		public int id;

		public static List<Ingredient> getIngredients(JdbcTemplate db) {
			List<Ingredient> items = db.query("SELECT * FROM ingredients WHERE listed;",
					new IngredientRowMapper());
			return items;
		}

		public static List<Ingredient> getAllIngredients(JdbcTemplate db) {
			List<Ingredient> items = db.query("SELECT * FROM ingredients;",
					new IngredientRowMapper());
			return items;
		}
	}

	public static class IngredientRowMapper implements RowMapper<Ingredient> {
		@Override
		public Ingredient mapRow(ResultSet rs, int rowNum) throws SQLException {
			Ingredient ingreadient = new Ingredient();
			ingreadient.id = rs.getInt("id");
			ingreadient.price = rs.getInt("price");
			ingreadient.name = rs.getString("name");
			ingreadient.listed = rs.getBoolean("listed");
			return ingreadient;
		}
	}

	public static class Drink {
		public String name;
		public int price;
		public boolean listed;
		@JsonIgnoreProperties(ignoreUnknown = true)
		public int id;

		public static List<Drink> getDrinks(JdbcTemplate db) {
			List<Drink> items = db.query("SELECT name,id,price,listed FROM drinks WHERE listed;",
					new DrinkRowMapper());
			return items;
		}

		public static List<Drink> getAllDrinks(JdbcTemplate db) {
			List<Drink> items = db.query("SELECT name,id,price,listed FROM drinks;",
					new DrinkRowMapper());
			return items;
		}
	}

	public static class DrinkRowMapper implements RowMapper<Drink> {
		@Override
		public Drink mapRow(ResultSet rs, int rowNum) throws SQLException {
			Drink drink = new Drink();
			drink.id = rs.getInt("id");
			drink.price = rs.getInt("price");
			drink.name = rs.getString("name");
			drink.listed = rs.getBoolean("listed");
			return drink;
		}
	}

	public static class Pizza {
		public String name;
		public int price;
		@JsonIgnoreProperties(ignoreUnknown = true)
		public int id;
		public boolean listed;
		public List<Ingredient> ingredients;

		public static List<Pizza> getPizzas(JdbcTemplate db) {
			List<Pizza> items = db.query("SELECT name,id,price,listed FROM pizzas WHERE listed;",
					new PizzaRowMapper(db));
			return items;
		}

		public static List<Pizza> getAllPizzas(JdbcTemplate db) {
			List<Pizza> items = db.query("SELECT name,id,price,listed FROM pizzas;",
					new PizzaRowMapper(db));
			return items;
		}
	}

	public static class PizzaRowMapper implements RowMapper<Pizza> {
		JdbcTemplate db;

		public PizzaRowMapper(JdbcTemplate db) {
			this.db = db;
		}

		@Override
		public Pizza mapRow(ResultSet rs, int rowNum) throws SQLException {
			Pizza pizza = new Pizza();
			pizza.id = rs.getInt("id");
			pizza.price = rs.getInt("price");
			pizza.name = rs.getString("name");
			pizza.listed = rs.getBoolean("listed");
			pizza.ingredients = this.db.query(
					"SELECT ingredients.* FROM contents JOIN ingredients " +
							"ON ingredients.id = contents.ingredient_id WHERE contents.pizza_id = ?;",
					new IngredientRowMapper(), pizza.id);
			return pizza;
		}
	}

	public static class OrderRequest {
		public int delivery_method;
		public int payment_method;
		@JsonIgnoreProperties(ignoreUnknown = true)
		public String cupon;
	}

	public static class OrderObject {
		public int id;
		public int user_id;
		public Date order_time;
		public Date delivery_time;
		public int total;
		public int status;
		public int delivery_method;
		public int payment_method;
		public int cupon;

		public static List<OrderObject> getAllPizzas(JdbcTemplate db) {
			List<OrderObject> items = db.query("SELECT * FROM orders;",
					new OrderObjectRowMapper());
			return items;
		}
	}

	public static class OrderObjectRowMapper implements RowMapper<OrderObject> {
		JdbcTemplate db;

		@Override
		public OrderObject mapRow(ResultSet rs, int rowNum) throws SQLException {
			OrderObject order = new OrderObject();
			order.id = rs.getInt("id");
			order.user_id = rs.getInt("user_id");
			order.order_time = rs.getDate("order_time");
			order.delivery_time = rs.getDate("delivery_time");
			order.total = rs.getInt("total");
			order.status = rs.getInt("status_id");
			order.delivery_method = rs.getInt("delivery_method_id");
			order.payment_method = rs.getInt("payment_method_id");
			order.cupon = rs.getInt("cupon_id");
			return order;
		}
	}

}
