var React = require('react');

var Grid = require('../Grid');
var ScrollPane = require('../ScrollPane');

module.exports = function() {
	let headerRowHeight = this.getHeaderRowHeight();
	let scrollBarWidth = this.getScrollBarWidth();
	let scrollBarHeight = this.getScrollBarHeight();
	return (
		<div className="ScrollableGrid">
			<Grid ref="grid"
				rows={ this.state.visibleRows }
				columns={ this.state.visibleColumns }
			/>
			<ScrollPane ref="scroller"
				contentWidth={ this.state.scrollContentWidth }
				contentHeight={ this.state.scrollContentHeight }
				maxWidth={ this.state.scrollContentWidth + scrollBarWidth }
				maxHeight={ headerRowHeight + this.state.scrollContentHeight + scrollBarHeight }
				onScrolled={ this.handleScrollPaneScrolled }
			/>
		</div>
	);
};
