package org.example.etc;

import java.util.List;

/**
 * ItList
 */
public class ItList<T> implements Iterable<T> {
	private List<T> list;

	public ItList(List<T> list) {
		this.list = list;
	}

	@Override
	public ItrList<T> iterator() {
		return new ItrList<T>(list);
	}

	public List<T> getList() {
		return this.list;
	}

	public T get(int index) {
		return this.list.get(index);
	}

}
