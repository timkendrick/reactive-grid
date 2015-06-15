var uid = 0;

class Row {
	constructor(model) {
		this.id = ++uid;
		this.model = model;
	}
}

module.exports = Row;
