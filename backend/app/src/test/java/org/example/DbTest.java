package org.example;

import static org.junit.jupiter.api.Assertions.*;

import java.sql.Connection;
import java.sql.DriverManager;

import org.example.etc.Database;
import org.junit.jupiter.api.Test;

/**
 * DbTest
 */
public class DbTest {
	@Test
	void testDatabaseConnection() {
		Database db = Database.getDatabase();
		assertNotNull(db, "database object should exist");
		assertNotNull(db.getConnection(), "Connection should be astablished");
	}

	@Test
	void testDatabaseSingleton() {
		Database db = Database.getDatabase();
		assertNotNull(db, "database object should exist");
		assertEquals(db, Database.getDatabase(), "new database should be the same object as old one");
	}
}
