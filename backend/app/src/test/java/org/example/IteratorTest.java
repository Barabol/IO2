package org.example;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;

import org.example.etc.ItList;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

@TestMethodOrder(MethodOrderer.MethodName.class)
public class IteratorTest {

	@Test
	public void selfTest() {
		ArrayList<Integer> l = new ArrayList<Integer>();
		l.add(0);
		l.add(1);

		ItList<Integer> list = new ItList<Integer>(l);

		int counter = 0;

		for (int x : list) {
			assertEquals(counter, x, "bad element");
			counter++;
		}
		assertEquals(2, counter, "bad ammount of elements");
	}

}
