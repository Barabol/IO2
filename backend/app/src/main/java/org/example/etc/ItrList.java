package org.example.etc;

import java.util.List;
import java.util.Iterator;

/**
 * ItList
 */
public class ItrList<T> implements Iterator<T> {

	private List<T> l = null;
	private int index = 0;

	public ItrList(List<T> list) {
		this.l = list;
		index = 0;
	}

	@Override
	public boolean hasNext() {
		if (l == null)
			return false;
		return index < l.size();
	}

	@Override
	public T next() {
		return this.l.get(this.index++);
	}

}
