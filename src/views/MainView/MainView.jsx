var React = require('react');

var ScrollableGrid = require('../../components/ScrollableGrid');

module.exports = function() {
	return (
		<div className="MainView">
			<ScrollableGrid
				rows={ this.getRows() }
				columns={ this.getColumns() }
			/>
		</div>
	);
};
