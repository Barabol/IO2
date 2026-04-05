package org.example.etc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

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

	private AppProperties() {

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
	}
}
