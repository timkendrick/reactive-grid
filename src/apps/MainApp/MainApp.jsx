var React = require('react');

var MainView = require('../../views/MainView');

module.exports = function() {
	return (
		<div className="MainApp">
			<MainView
				dataSource={ this.props.gridDataSource }
			/>
		</div>
	);
};
