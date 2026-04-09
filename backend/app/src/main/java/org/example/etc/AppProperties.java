package org.example.etc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.example.etc.DatabaseObjects.Drink;
import org.example.etc.DatabaseObjects.DrinkRowMapper;
import org.example.etc.DatabaseObjects.Ingredient;
import org.example.etc.DatabaseObjects.IngredientRowMapper;
import org.example.etc.DatabaseObjects.Pizza;
import org.example.etc.DatabaseObjects.PizzaRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

/**
 * AppProperties
 *
 * singleton
 */
public class AppProperties {

	public static class DictionaryField {
		public int id;
		public String name;
	}

	public static class DictRowMapper implements RowMapper<DictionaryField> {
		@Override
		public DictionaryField mapRow(ResultSet rs, int rowNum) throws SQLException {
			DictionaryField field = new DictionaryField();
			field.id = rs.getInt("id");
			field.name = rs.getString("name");
			return field;
		}
	}

	private static AppProperties properties;

	public List<DictionaryField> accountTypes = null;
	public List<DictionaryField> orderStatus = null;
	public List<DictionaryField> deliveryMethods = null;
	public List<DictionaryField> paymentMethods = null;

	public List<Pizza> pizzas = null;
	public List<Drink> drinks = null;
	public List<Ingredient> ingredients = null;

	private AppProperties() {

	}

	public Integer getDrinkPrice(int index) {
		for (int x = 0; x < this.drinks.size(); x++) {
			if (this.drinks.get(x).id == index)
				return this.drinks.get(x).price;
			if (this.drinks.get(x).id > index)
				return null;
		}
		return null;
	}

	public Integer getPizzaPrice(int index) {
		for (int x = 0; x < this.pizzas.size(); x++) {
			if (this.pizzas.get(x).id == index) {
				int val = 0;
				List<Ingredient> ing = this.pizzas.get(x).ingredients;
				for (int y = 0; y < ing.size(); y++)
					val += ing.get(x).price;
				return this.pizzas.get(x).price + val;
			}
			if (this.pizzas.get(x).id > index)
				return null;
		}
		return null;
	}

	public Pizza getPizza(int index) {
		for (int x = 0; x < this.pizzas.size(); x++) {
			if (this.pizzas.get(x).id == index)
				return this.pizzas.get(x);
			if (this.pizzas.get(x).id > index)
				return null;
		}
		return null;
	}

	public static AppProperties getProperties(JdbcTemplate db) {
		if (properties == null) {
			properties = new AppProperties();
			properties.reload(db);
			return properties;
		}
		return properties;
	}

	public void reload(JdbcTemplate db) {
		this.accountTypes = db.query("SELECT * FROM account_types ORDER BY id ASC", new DictRowMapper());
		this.orderStatus = db.query("SELECT * FROM status ORDER BY id ASC", new DictRowMapper());
		this.paymentMethods = db.query("SELECT * FROM payment_methods ORDER BY id ASC", new DictRowMapper());
		this.deliveryMethods = db.query("SELECT * FROM delivery_methods  ORDER BY id ASC", new DictRowMapper());
		this.drinks = db.query("SELECT * FROM drinks WHERE listed ORDER BY id ASC", new DrinkRowMapper());
		this.pizzas = db.query("SELECT * FROM pizzas WHERE listed ORDER BY id ASC", new PizzaRowMapper(db));
		this.ingredients = db.query("SELECT * FROM ingredients WHERE listed ORDER BY id ASC", new IngredientRowMapper());
	}
}
