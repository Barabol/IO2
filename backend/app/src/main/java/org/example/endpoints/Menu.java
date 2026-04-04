package org.example.endpoints;

import java.util.List;

import org.example.etc.DatabaseObjects.Drink;
import org.example.etc.DatabaseObjects.Ingredient;
import org.example.etc.DatabaseObjects.Pizza;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/menu")
public class Menu {
	@Autowired
	JdbcTemplate jdbcTemplate;

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
