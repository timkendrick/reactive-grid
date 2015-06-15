var deepEqual = require('deep-equal');

class CompositeCache {
	constructor() {
		this._parameters = null;
		this._value = null;
	}

	isValidFor(parameters) {
		if (!this._value) { return false; }
		let isEqual = objectsAreEqual(parameters, this._parameters);
		return isEqual;
	}

	get() {
		return this._value;
	}

	set(parameters, value) {
		this._parameters = parameters;
		this._value = value;
	}

	invalidate() {
		this._value = null;
		this._parameters = null;
	}
}

function objectsAreEqual(a, b) {
	return deepEqual(a, b, { strict: true });
}

module.exports = CompositeCache;
