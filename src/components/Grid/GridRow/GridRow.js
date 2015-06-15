var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var GridRow = React.createClass({

	render: require('./GridRow.jsx'),

	propTypes: {
		row: React.PropTypes.object,
		columns: React.PropTypes.array
	},

	mixins: [
		PureRenderMixin
	]
});

module.exports = GridRow;
