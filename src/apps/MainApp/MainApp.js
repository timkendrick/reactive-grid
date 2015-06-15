var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var PropTypes = require('../../utils/PropTypes');

var MainApp = React.createClass({

	render: require('./MainApp.jsx'),

	propTypes: {
		gridDataSource: PropTypes.gridDataSource.isRequired
	},

	mixins: [
		PureRenderMixin
	]
});

module.exports = MainApp;
