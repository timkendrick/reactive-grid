var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

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
			rowOffset: props.rowOffset || 0,
			columnOffset: props.columnOffset || 0,
			containerWidth: 0,
			containerHeight: 0,
			scrollPaneWidth: 0,
			scrollPaneHeight: 0,
			numVisibleRows: 0,
			numVisibleColumns: 0,
			visibleRows: [],
			visibleColumns: []
		};
	},

	mixins: [
		PureRenderMixin
	],

	componentDidMount: function() {
		let componentElement = React.findDOMNode ? React.findDOMNode(this) : this.getDOMNode();
		let componentWidth = getElementWidth(componentElement);
		let componentHeight = getElementHeight(componentElement);
		let scrollPaneWidth = componentWidth - this.getScrollBarWidth();
		let scrollPaneHeight = componentHeight - this.getScrollBarHeight();
		let containerWidth = scrollPaneWidth;
		let containerHeight = scrollPaneHeight - this.getHeaderRowHeight();

		let rowOffset = this.state.rowOffset;
		let rows = this.props.rows;

		let numVisibleRows = getNumVisibleRows(containerHeight, rows, rowOffset);
		let visibleRows = getSlicedRows(this.props.rows, rowOffset, numVisibleRows);

		let columns = this.props.columns;
		let columnOffset = this.state.columnOffset;
		let numVisibleColumns = getNumVisibleColumns(containerWidth, columns, columnOffset);
		let visibleColumns = getSlicedColumns(this.props.columns, columnOffset, numVisibleColumns);

		this.setState({
			containerWidth: containerWidth,
			containerHeight: containerHeight,
			scrollPaneWidth: scrollPaneWidth,
			scrollPaneHeight: scrollPaneHeight,
			numVisibleRows: numVisibleRows,
			numVisibleColumns: numVisibleColumns,
			visibleRows: visibleRows,
			visibleColumns: visibleColumns
		});
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

	getRowScrollOffset: function() {
		return getRowScrollOffset(this.state.rowOffset, this.props.rows);
	},

	getColumnScrollOffset: function() {
		return getColumnScrollOffset(this.state.columnOffset, this.props.columns);
	},

	getScrollContentWidth: function() {
		let columns = this.props.columns;
		let scrollPaneWidth = this.state.scrollPaneWidth;
		let containerWidth = this.state.containerWidth;
		return getScrollContentWidth(columns, containerWidth, scrollPaneWidth);
	},

	getScrollContentHeight: function() {
		let rows = this.props.rows;
		let scrollPaneHeight = this.state.scrollPaneHeight;
		let containerHeight = this.state.containerHeight;
		return getScrollContentHeight(rows, containerHeight, scrollPaneHeight);
	},

	handleScrollPaneScrolled: function(x, y) {
		let rowOffset = getRowIndex(y, this.props.rows);
		let columnOffset = getColumnIndex(x, this.props.columns);

		let hasUpdates = false;
		let updates = {};

		if (columnOffset !== this.state.columnOffset) {
			let containerWidth = this.state.containerWidth;
			let columns = this.props.columns;
			let numVisibleColumns = getNumVisibleColumns(containerWidth, columns, columnOffset);
			let visibleColumns = getSlicedColumns(columns, columnOffset, numVisibleColumns);
			updates.columnOffset = columnOffset;
			updates.numVisibleColumns = numVisibleColumns;
			updates.visibleColumns = visibleColumns;
			hasUpdates = true;
		}

		if (rowOffset !== this.state.rowOffset) {
			let containerHeight = this.state.containerHeight;
			let rows = this.props.rows;
			let numVisibleRows = getNumVisibleRows(containerHeight, rows, rowOffset);
			let visibleRows = getSlicedRows(rows, rowOffset, numVisibleRows);
			updates.rowOffset = rowOffset;
			updates.numVisibleRows = numVisibleRows;
			updates.visibleRows = visibleRows;
			hasUpdates = true;
		}

		if (hasUpdates) {
			this.setState(updates);
		}
	}
});

function getRowIndex(scrollOffset, rows) {
	// TODO: Account for sticky rows
	return Math.round(scrollOffset / ROW_HEIGHT);
}

function getColumnIndex(scrollOffset, columns) {
	// TODO: Account for sticky columns
	let combinedWidth = 0;
	for (var i = 0; i < columns.length; i++) {
		combinedWidth += columns[i].width;
		if (combinedWidth > scrollOffset) {
			i++;
			break;
		}
	}
	return i;
}

function getRowScrollOffset(rowIndex, rows) {
	// TODO: Account for sticky rows
	let rowsAbove = rows.slice(0, rowIndex);
	return getRowsHeight(rowsAbove);
}

function getColumnScrollOffset(columnOffset, columns) {
	// TODO: Account for sticky columns
	let columnsBefore = columns.slice(0, columnOffset);
	return getColumnsWidth(columnsBefore);
}

function getScrollContentWidth(columns, containerWidth, scrollPaneWidth) {
	let totalColumnWidth = getColumnsWidth(columns);
	if (totalColumnWidth <= containerWidth) { return totalColumnWidth; }
	let lastPageWidth = getLastPageWidth(containerWidth, columns);
	let scrollBuffer = scrollPaneWidth - lastPageWidth;
	let scrollContentWidth = totalColumnWidth + scrollBuffer;
	return scrollContentWidth;


	function getLastPageWidth(containerWidth, columns) {
		let stickyColumns = columns.filter((column) => column.sticky);
		let nonStickyColumns = columns.filter((column) => !column.sticky);
		let stickyColumnsWidth = getColumnsWidth(stickyColumns);
		let availableWidth = Math.max(0, containerWidth - stickyColumnsWidth);
		let combinedWidth = 0;
		for (var i = nonStickyColumns.length - 1; i >= 0; i--) {
			combinedWidth += nonStickyColumns[i].width;
			if (combinedWidth > availableWidth) {
				i++;
				break;
			}
		}
		let lastPageColumns = nonStickyColumns.slice(i);
		let lastPageWidth = stickyColumnsWidth + getColumnsWidth(lastPageColumns);
		return lastPageWidth;
	}
}

function getScrollContentHeight(rows, containerHeight, scrollPaneHeight) {
	let totalRowHeight = getRowsHeight(rows);
	if (totalRowHeight <= containerHeight) { return totalRowHeight; }
	let lastPageHeight = getLastPageHeight(containerHeight, rows);
	let scrollBuffer = scrollPaneHeight - lastPageHeight;
	let scrollContentHeight = totalRowHeight + scrollBuffer;
	return scrollContentHeight;


	function getLastPageHeight(containerHeight, rows) {
		let stickyRows = rows.filter((row) => row.sticky);
		let stickyRowsHeight = getRowsHeight(stickyRows);
		let availableHeight = Math.max(0, containerHeight - stickyRowsHeight);
		let lastPageHeight = stickyRowsHeight + Math.floor(availableHeight / ROW_HEIGHT) * ROW_HEIGHT;
		return lastPageHeight;
	}
}

function getNumVisibleRows(availableHeight, rows, rowOffset) {
	let numVisibleRows = Math.ceil(availableHeight / ROW_HEIGHT);
	numVisibleRows = Math.min(numVisibleRows, rows.length);
	return numVisibleRows;
}

function getNumVisibleColumns(containerWidth, columns, columnOffset) {
	// TODO: sort sticky columns out properly
	let stickyColumnsBefore = columns.slice(0, columnOffset).filter((column) => column.sticky);
	let stickyColumnsWidth = getColumnsWidth(stickyColumnsBefore);
	let availableWidth = containerWidth - stickyColumnsWidth;
	let currentWidth = 0;
	for (var i = columnOffset; i < columns.length; i++) {
		currentWidth += columns[i].width;
		if (currentWidth >= availableWidth) {
			i++;
			break;
		}
	}
	return stickyColumnsBefore.length + (i - columnOffset);
}

function getRowsHeight(rows) {
	return rows.length * ROW_HEIGHT;
}

function getColumnsWidth(columns) {
	return columns.reduce((sum, column) => sum + column.width, 0);
}

function getSlicedRows(rows, rowOffset, numRows) {
	return getSlice(rows, rowOffset, numRows);
}

function getSlicedColumns(columns, columnOffset, numColumns) {
	return getSlice(columns, columnOffset, numColumns);
}

function getSlice(items, offset, numItems) {
	let stickyItemsAbove = items.slice(0, offset).filter(function(item) {
		return Boolean(item.sticky);
	});
	let itemsInView = items.slice(offset, offset + Math.max(0, numItems - stickyItemsAbove.length));
	let stickyItemsBelow = items.slice(offset + numItems - stickyItemsAbove.length).filter(function(item) {
		return Boolean(item.sticky);
	});
	let slicedItems = stickyItemsAbove.concat(itemsInView).concat(stickyItemsBelow);

	if (slicedItems.length > numItems) {
		slicedItems = trimNonStickyItems(slicedItems, numItems);
	}
	if (slicedItems.length > numItems) {
		slicedItems = slicedItems.slice(0, numItems);
	}

	return slicedItems;


	function trimNonStickyItems(items, desiredLength) {
		let numExtraItems = items.length - desiredLength;
		return items.reverse().filter(function(item, index) {
			if (numExtraItems <= 0) { return true; }
			if (Boolean(item.state.sticky)) { return true; }
			numExtraItems--;
			return false;
		}).reverse();
	}
}



function getElementWidth(element) {
	return element.clientWidth;
}

function getElementHeight(element) {
	return element.clientHeight;
}

module.exports = ScrollableGrid;
