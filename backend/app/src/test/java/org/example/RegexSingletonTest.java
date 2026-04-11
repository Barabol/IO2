
package org.example;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.example.etc.RegexDefinitions;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

/**
 * RegexSingletonTest
 */
@TestMethodOrder(MethodOrderer.MethodName.class)
public class RegexSingletonTest {

	@Test
	void isValid() {
		RegexDefinitions re = RegexDefinitions.getRegex();
		assertEquals(re, RegexDefinitions.getRegex());
	}
}
