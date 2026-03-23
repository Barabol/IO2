package org.example.endpoints;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.servlet.http.HttpSession;

/**
 * User
 */
@RestController
@RequestMapping("/user")
public class User {

	public class UserInfo {
		public String username;
		public String session;
		public Integer id;
	}

	public class UserCredentials {
		public String username;
		public String password;
	}

	public UserInfo getUserInfo(HttpSession session){
		return null;
	}

	@PostMapping("/register")
	public String userRegister(UserCredentials user) {
		return null;
	}

	@PostMapping("/login")
	public String userLogin(HttpSession session,
			@RequestParam(required = false) UserCredentials user) {
		return session.getId();
	}

	@GetMapping("/login") // TODO: remove
	public String userLoginTest(HttpSession session) {
		return session.getId();
	}

	@GetMapping("/logout")
	public String userLogout(HttpSession session) {
		String sid = session.getId();
		session.invalidate();
		return sid;
	}
}
