package org.example.etc;

import org.springframework.jdbc.core.JdbcTemplate;

/**
 * AppProperties
 *
 * singleton
 */
public class AppProperties {

	private static AppProperties properties;

	// TODO: dać kilka obiektów do properties by nie żyłować bazy (głównie
	// słownikowe pola z bazy)

	private AppProperties() {

	}

	public static AppProperties getProperties() {
		if (properties == null) {
			properties = new AppProperties();
			return properties;
		}
		return properties;
	}

	public void reload(JdbcTemplate db) {

	}
}
