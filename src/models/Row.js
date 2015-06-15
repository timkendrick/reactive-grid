var uid = 0;

class Row {
	constructor(model, {
		sticky = false
	} = {}) {
		this.id = ++uid;
		this.model = model;
		this.sticky = sticky;
	}
}

module.exports = Row;
