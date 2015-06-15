var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Grid = React.createClass({

	render: require('./Grid.jsx'),

	propTypes: {
		rows: React.PropTypes.array.isRequired,
		columns: React.PropTypes.array.isRequired
	},

	mixins: [
		PureRenderMixin
	]
});

module.exports = Grid;
