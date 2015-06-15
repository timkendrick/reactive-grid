var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var PropTypes = require('../../utils/PropTypes');

var MainView = React.createClass({

	render: require('./MainView.jsx'),

	propTypes: {
		dataSource: PropTypes.gridDataSource.isRequired
	},

	mixins: [
		PureRenderMixin
	],

	getRows: function() {
		return this.props.dataSource.getRows();
	},

	getColumns: function() {
		return this.props.dataSource.getColumns();
	}
});

module.exports = MainView;
