var React = require('react');

module.exports = {
	gridDataSource: React.PropTypes.shape({
		getColumns: React.PropTypes.func,
		getRows: React.PropTypes.func
	})
};
