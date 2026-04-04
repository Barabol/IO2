package org.example.etc;

/**
 * RegexDefinitions
 *
 * singletion
 */
public class RegexDefinitions {

	private static RegexDefinitions regex = null;
	public final String email = "^([a-zA-Z0-9]|\\.|_){1,25}@[a-z](([a-z0-9]|\\.)){2,20}\\.([a-z]){2,4}$";
	public final String name = "^[A-Z][a-z]{2,24}$";
	public final String surname = "^[A-Z][a-z]{2,29}$";
	public final String password = "^[a-zA-Z0-9]{5,}$";
	public final String cuponName = "^[a-zA-Z0-9]{5,15}$";

	private RegexDefinitions() {

	}

	public static RegexDefinitions getRegex() {
		if (regex == null) {
			regex = new RegexDefinitions();
			return regex;
		}
		return regex;
	}
}
