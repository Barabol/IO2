package org.example.endpoints;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.example.etc.RegexDefinitions;
import org.mindrot.jbcrypt.BCrypt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/**
 * User
 */
@RestController
@RequestMapping("/user")
public class User {
	@Autowired
	JdbcTemplate jdbcTemplate;

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
			} catch(NullPointerException e){
				return null;
			}
			return info;
		}

		public static UserInfo cheackUserPermision(HttpSession session, JdbcTemplate db, AccountTypes type) {
			UserInfo info = getFromSession(session, db);
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

	@PostMapping("/register") // NOTE: done
	public String userRegister(HttpSession session, HttpServletResponse response,
			@Validated @RequestBody UserCreation user) {
		return user.createUser(session, response, jdbcTemplate);
	}

	@PostMapping("/login") // NOTE: done
	public String userLogin(HttpSession session, HttpServletResponse response, HttpServletRequest request,
			@Validated @RequestBody UserCredentials user) {
		return user.loggin(session, response, request, jdbcTemplate);
	}

	@PostMapping("/changePassword") // NOTE: done
	public String userChangePassword(HttpSession session, HttpServletResponse response,
			@Validated @RequestBody PasswordChange passwordChange) {
		return passwordChange.changePassword(session, response, jdbcTemplate);
	}

	@GetMapping("/logout") // NOTE: done
	public String userLogout(HttpSession session) {
		session.invalidate();
		return "OK";
	}
}
