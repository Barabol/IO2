package org.example.endpoints;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.example.etc.AppProperties;
import org.example.etc.AppProperties.DictionaryField;
import org.example.etc.DatabaseObjects.PasswordChange;
import org.example.etc.DatabaseObjects.UserCreation;
import org.example.etc.DatabaseObjects.UserCredentials;
import org.example.etc.DatabaseObjects.UserInfo;

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

	@GetMapping("/info") // NOTE: done
	public UserInfo userInfo(HttpSession session) {
		UserInfo info = UserInfo.getFromSession(session, jdbcTemplate);
		if (info == null) {
			info = new UserInfo();
			info.name = "none";
			info.surname = "none";
			info.email = "none";
			info.account_type = 4;
			info.id = 0;
			info.password = "none";
		} else
			info.password = "unavailable";
		return info;
	}

	@GetMapping("/accountTypes")
	public @ResponseBody List<DictionaryField> getPermissions(HttpSession session, HttpServletResponse response) {
		return AppProperties.getProperties(jdbcTemplate).accountTypes;
	}
}
