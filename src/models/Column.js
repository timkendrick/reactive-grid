var uid = 0;

class Column {
	constructor({
		width = 100,
		label = null,
		sticky = false
	} = {}) {
		this.id = ++uid;
		this.label = label;
		this.width = width;
		this.sticky = sticky;
	}
}

module.exports = Column;
