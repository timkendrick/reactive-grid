var React = require('react');

var Grid = require('../Grid');
var ScrollPane = require('../ScrollPane');

module.exports = function() {
	let headerRowHeight = this.getHeaderRowHeight();
	let scrollBarWidth = this.getScrollBarWidth();
	let scrollBarHeight = this.getScrollBarHeight();
	let scrollContentWidth = this.getScrollContentWidth();
	let scrollContentHeight = this.getScrollContentHeight();
	let scrollTop = this.getRowScrollOffset(this.state.rowOffset);
	let scrollLeft = this.getColumnScrollOffset(this.state.columnOffset);
	return (
		<div className="ScrollableGrid">
			<Grid
				rows={ this.state.visibleRows }
				columns={ this.state.visibleColumns }
			/>
			<ScrollPane
				contentWidth={ scrollContentWidth }
				contentHeight={ scrollContentHeight }
				maxWidth={ scrollContentWidth + scrollBarWidth }
				maxHeight={ headerRowHeight + scrollContentHeight + scrollBarHeight }
				scrollTop={ scrollTop }
				scrollLeft={ scrollLeft }
				onScrolled={ this.handleScrollPaneScrolled }
			/>
		</div>
	);
};
