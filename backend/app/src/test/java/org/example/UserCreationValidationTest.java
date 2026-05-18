package org.example;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.example.etc.DatabaseObjects.UserCreation;
import org.junit.jupiter.api.Test;

public class UserCreationValidationTest {

    @Test
    public void validUserValidation() {
        UserCreation user = new UserCreation();
        user.name = "Jarosław";
        user.surname = "Kaczyński";
        user.email = "jaroslaw.kaczynskik@example.com";
        user.password = "haslo123";

        assertTrue(user.validate(), "Poprawne dane");
    }

    @Test
    public void missingFieldsValidation() {
        UserCreation user = new UserCreation();
        assertFalse(user.validate(), "Obiekt z nullami");
    }

    @Test
    public void invalidNameValidation() {
        UserCreation user = new UserCreation();
        user.name = "jarosław";
        user.surname = "Kaczyński";
        user.email = "jaroslaw.kaczynskik@example.com";
        user.password = "haslo123";

        assertFalse(user.validate(), "Imie z malej litery");
    }

    @Test
    public void invalidEmailValidation() {
        UserCreation user = new UserCreation();
        user.name = "Jarosław";
        user.surname = "Kaczyński";
        user.email = "zly-email.com";
        user.password = "haslo123";

        assertFalse(user.validate(), "Niepoprawny format email");
    }

    @Test
    public void invalidPasswordValidation() {
        UserCreation user = new UserCreation();
        user.name = "Jarosław";
        user.surname = "Kaczyński";
        user.email = "jaroslaw.kaczynskik@example.com";
        user.password = "123";

        assertFalse(user.validate(), "Za krotkie haslo");
    }
}