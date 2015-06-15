var CompositeCache = require('./CompositeCache');

class Paginator {
	constructor(items, getItemSize) {
		this.items = items;
		this.getItemSize = getItemSize;
		this._cachedItems = new CompositeCache();
		this._cachedTotalSize = new CompositeCache();
		this._cachedScrollContentSize = new CompositeCache();
	}

	getItems(containerSize, offset) {
		let currentState = {
			items: this.items,
			containerSize: containerSize,
			offset: offset
		};
		let isCached = this._cachedItems.isValidFor(currentState);
		if (isCached) { return this._cachedItems.get(); }

		let paginatedItems = getPaginatedItems(this.items, containerSize, offset, this.getItemSize);

		this._cachedItems.set(currentState, paginatedItems);
		return paginatedItems;
	}

	getTotalSize() {
		let currentState = {
			items: this.items
		};
		let isCached = this._cachedTotalSize.isValidFor(currentState);
		if (isCached) { return this._cachedTotalSize.get(); }

		let itemsSize = getItemsSize(this.items, this.getItemSize);

		this._cachedTotalSize.set(currentState, itemsSize);
		return itemsSize;
	}

	getScrollContentSize(containerSize) {
		let currentState = {
			items: this.items,
			containerSize: containerSize
		};
		let isCached = this._cachedScrollContentSize.isValidFor(currentState);
		if (isCached) { return this._cachedTotalSize.get(); }

		let contentSize = this.getTotalSize();
		let scrollContentSize = getScrollContentSize(this.items, contentSize, containerSize, this.getItemSize);

		this._cachedScrollContentSize.set(currentState, scrollContentSize);
		return scrollContentSize;
	}

	getOffsetAt(position) {
		let items = this.items;
		let offset = getOffsetAt(position, items, this.getItemSize);
		return offset;

		function getOffsetAt(position, items, getItemSize) {
			let totalSize = 0;
			for (var i = 0; i < items.length; i++) {
				let item = items[i];
				let itemSize = getItemSize(item);
				totalSize += itemSize;
				if (totalSize > position) {
					return i;
				}
			}
			return i;
		}
	}
}

function getPaginatedItems(items, containerSize, offset, getItemSize) {
	if (containerSize <= 0) { return []; }
	let itemsAbove = items.slice(0, offset);
	let itemsBelow = items.slice(offset);
	let stickyItemsAbove = getStickyItems(itemsAbove);
	let orderedItems = stickyItemsAbove.slice();
	let totalSize = getItemsSize(orderedItems, getItemSize);
	let remainingStickyItems = getStickyItems(itemsBelow);
	let remainingStickyItemsSize = getItemsSize(remainingStickyItems, getItemSize);
	for (let i = offset; i < items.length && (totalSize < containerSize - remainingStickyItemsSize); i++) {
		let item = items[i];
		orderedItems.push(item);
		let itemSize = getItemSize(item);
		totalSize += itemSize;
		if (item.sticky) {
			remainingStickyItemsSize -= itemSize;
			remainingStickyItems.shift();
		}
	}
	orderedItems = orderedItems.concat(remainingStickyItems);
	return orderedItems;
}

function getScrollContentSize(items, contentSize, containerSize, getItemSize) {
	if (contentSize <= containerSize) { return contentSize; }

	let stickyItems = getStickyItems(items);
	let stickyItemsSize = getItemsSize(stickyItems, getItemSize);
	let lastPageSize = 0;
	let availableSize = containerSize - stickyItemsSize;
	for (var i = items.length - 1; (i >= 0) && (lastPageSize < availableSize); i--) {
		let item = items[i];
		if (item.sticky) { continue; }
		let itemSize = getItemSize(item);
		if (lastPageSize + itemSize > availableSize) { break; }
		lastPageSize += itemSize;
	}
	let scrollBuffer = containerSize - lastPageSize;
	let scrollContentSize = contentSize + scrollBuffer;
	return scrollContentSize;
}

function getItemsSize(items, getItemSize) {
	return items.reduce((sum, item) => sum + getItemSize(item), 0);
}

function getStickyItems(items) {
	return items.filter((item) => item.sticky);
}

module.exports = Paginator;
