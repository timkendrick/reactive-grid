var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Paginator = require('../../utils/Paginator');

const SCROLLBAR_WIDTH = 15;
const SCROLLBAR_HEIGHT = 15;

const ROW_HEIGHT = 19;
const HEADER_ROW_HEIGHT = 19;

var ScrollableGrid = React.createClass({

	render: require('./ScrollableGrid.jsx'),

	propTypes: {
		rows: React.PropTypes.array.isRequired,
		columns: React.PropTypes.array.isRequired,
		rowOffset: React.PropTypes.number,
		columnOffset: React.PropTypes.number
	},

	getInitialState: function(props) {
		props = props || this.props;
		return {
			columnPaginator: new Paginator(props.columns, getColumnSize),
			rowPaginator: new Paginator(props.rows, getRowSize),
			visibleRows: [],
			visibleColumns: [],
			containerWidth: 0,
			containerHeight: 0,
			scrollContentWidth: 0,
			scrollContentHeight: 0,
			scrollRatioX: 1,
			scrollRatioY: 1
		};
	},

	mixins: [
		PureRenderMixin
	],

	componentDidMount: function() {
		this.updateSize();
		window.addEventListener('resize', this.onWindowResized);
	},

	componentWillUnmount: function() {
		window.removeEventListener('resize', this.onWindowResized);
	},

	onWindowResized: function() {
		this.updateSize();
	},

	updateSize: function() {
		let self = this;
		let gridElement = getDomElement(this.refs.grid);
		let scrollPaneElement = getDomElement(this.refs.scroller);

		let scrollBarWidth = this.getScrollBarWidth();
		let scrollBarHeight = this.getScrollBarHeight();

		let scrollPaneWidth = getElementWidth(scrollPaneElement) - scrollBarWidth;
		let scrollPaneHeight = getElementHeight(scrollPaneElement);

		let containerWidth = getElementWidth(gridElement) - scrollBarWidth;
		let containerHeight = getElementHeight(gridElement) - this.getHeaderRowHeight() - scrollBarHeight;

		let columnPaginator = this.state.columnPaginator;
		let rowPaginator = this.state.rowPaginator;

		let scrollRatioX = scrollPaneWidth / containerWidth;
		let scrollRatioY = scrollPaneHeight / containerHeight;

		let scrollContentWidth = columnPaginator.getScrollContentSize(containerWidth) * scrollRatioX;
		let scrollContentHeight = rowPaginator.getScrollContentSize(containerHeight) * scrollRatioY;

		let visibleRows = rowPaginator.getItems(containerHeight, 0);
		let visibleColumns = columnPaginator.getItems(containerWidth, 0);

		this.setState({
			visibleRows: visibleRows,
			visibleColumns: visibleColumns,
			containerWidth: containerWidth,
			containerHeight: containerHeight,
			scrollContentWidth: scrollContentWidth,
			scrollContentHeight: scrollContentHeight,
			scrollRatioX: scrollRatioX,
			scrollRatioY: scrollRatioY
		});


		function getDomElement(component) {
			return React.findDOMNode ? React.findDOMNode(self) : self.getDOMNode();
		}
	},

	getHeaderRowHeight: function() {
		return HEADER_ROW_HEIGHT;
	},

	getScrollBarWidth: function() {
		return SCROLLBAR_WIDTH;
	},

	getScrollBarHeight: function() {
		return SCROLLBAR_HEIGHT;
	},

	handleScrollPaneScrolled: function(x, y) {
		let scaledX = x / this.state.scrollRatioX;
		let scaledY = y / this.state.scrollRatioY;

		let columnPaginator = this.state.columnPaginator;
		let rowPaginator = this.state.rowPaginator;

		let containerWidth = this.state.containerWidth;
		let containerHeight = this.state.containerHeight;

		let columnOffset = columnPaginator.getOffsetAt(scaledX);
		let rowOffset = rowPaginator.getOffsetAt(scaledY);

		let visibleColumns = columnPaginator.getItems(containerWidth, columnOffset);
		let visibleRows = rowPaginator.getItems(containerHeight, rowOffset);

		this.setState({
			visibleRows: visibleRows,
			visibleColumns: visibleColumns
		});
	}
});

function getColumnSize(column) {
	return column.width;
}

function getRowSize(row) {
	return ROW_HEIGHT;
}

function getElementWidth(element) {
	return element.clientWidth;
}

function getElementHeight(element) {
	return element.clientHeight;
}

module.exports = ScrollableGrid;
