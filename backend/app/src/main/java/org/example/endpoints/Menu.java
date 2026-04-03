package org.example.endpoints;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@RestController
@RequestMapping("/menu")
public class Menu {
	@Autowired
	JdbcTemplate jdbcTemplate;

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

	@GetMapping("/pizzas")
	public @ResponseBody List<Pizza> getPizzas() {
		List<Pizza> items = Pizza.getPizzas(jdbcTemplate);
		return items;
	}

	@GetMapping("/drinks")
	public @ResponseBody List<Drink> getDrinks() {
		List<Drink> items = Drink.getDrinks(jdbcTemplate);
		return items;
	}

	@GetMapping("/ingredients")
	public @ResponseBody List<Ingredient> getIngredients() {
		List<Ingredient> items = Ingredient.getIngredients(jdbcTemplate);
		return items;
	}
}
