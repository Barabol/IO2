package org.example.etc;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

// singleton
public class Database {
	static private Database db = null;
	private Connection con = null;

	private Database() {
		Database.db = this;
		Properties properties = new Properties();
		InputStream is = Database.class.getClassLoader().getResourceAsStream("application.properties");
		System.out.println("Classpath entries:");
		if (is == null) {
			System.err.println("unable to open db config file");
			return;
		}
		try {
			properties.load(is);
		} catch (IOException e) {
			System.err.println("unable to load db config file");
			return;
		}
		try {
			this.con = DriverManager.getConnection(
					properties.getProperty("spring.datasource.url"),
					properties.getProperty("spring.datasource.user"),
					properties.getProperty("spring.datasource.password"));
		} catch (SQLException e) {
			System.err.println("unable to load values db config file");
			return;
		}
	}

	static public Database getDatabase() {
		if (db == null)
			new Database();
		return db;
	}

	public Connection getConnection() {
		return this.con;
	}

}
