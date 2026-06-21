package org.example;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.example.etc.DatabaseObjects.Ingredient;
import org.example.etc.DatabaseObjects.IngredientRowMapper;
import org.example.etc.DatabaseObjects.NewPizza;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

public class NewPizzaValidationTest {

    private Ingredient createMockIngredient(int id, String name) {
        Ingredient ing = new Ingredient();
        ing.id = id;
        ing.name = name;
        ing.price = 5;
        ing.listed = true;
        return ing;
    }

    @Test
    public void existingIngredientsShouldPassValidation() {
        JdbcTemplate mockDb = mock(JdbcTemplate.class);

        // sztuczne dane dla bazy
        List<Ingredient> mockDbIngredients = new ArrayList<>();
        mockDbIngredients.add(createMockIngredient(1, "Ser"));
        mockDbIngredients.add(createMockIngredient(2, "Szynka"));
        mockDbIngredients.add(createMockIngredient(3, "Pieczarki"));

        when(mockDb.query(anyString(), any(IngredientRowMapper.class))).thenReturn(mockDbIngredients);

        NewPizza pizza = new NewPizza();
        pizza.name = "Capricciosa";
        pizza.price = 30;
        pizza.listed = true;
        pizza.ingredients = Arrays.asList(1, 2, 3);

        assertTrue(pizza.validate(mockDb), "Pizza z istniejącymi skladnikami");
    }

}
