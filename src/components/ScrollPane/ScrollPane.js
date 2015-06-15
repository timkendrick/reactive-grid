var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var ScrollPane = React.createClass({

	render: require('./ScrollPane.jsx'),

	propTypes: {
		minWidth: React.PropTypes.number,
		minHeight: React.PropTypes.number,
		maxWidth: React.PropTypes.number,
		maxHeight: React.PropTypes.number,
		contentWidth: React.PropTypes.number,
		contentHeight: React.PropTypes.number,
		onScrolled: React.PropTypes.func
	},

	mixins: [
		PureRenderMixin
	],

	handleScrolled: function(event) {
		var scrollElement = event.currentTarget;
		var scrollX = (this.props.contentWidth ? scrollElement.scrollLeft : 0);
		var scrollY = (this.props.contentHeight ? scrollElement.scrollTop : 0);
		this.props.onScrolled(scrollX, scrollY);
	}
});

module.exports = ScrollPane;
