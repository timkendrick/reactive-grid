var React = require('react');

module.exports = function() {
	return (
		<div className="ScrollPane"
			style={{
				minWidth: this.props.minWidth,
				minHeight: this.props.minHeight,
				maxWidth: this.props.maxWidth,
				maxHeight: this.props.maxHeight,
				overflowX: (this.props.contentWidth ? 'scroll' : null),
				overflowY: (this.props.contentHeight ? 'scroll' : null)
			}}
			onScroll={ this.handleScrolled }
		>
			<div className="ScrollPane-content" style={{
				width: this.props.contentWidth || '100%',
				height: this.props.contentHeight || '100%'
			}}></div>
		</div>
	);
};
