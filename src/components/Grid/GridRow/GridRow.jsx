var React = require('react');

module.exports = function() {
	let row = this.props.row;
	let columns = this.props.columns;
	return (
		<tr className="GridRow">
			{
				columns.map((column) => {
					let cellValue = row.model[column.id];
					return (
						<td key={ 'cell-' + column.id }>{ cellValue }</td>
					);
				})
			}
		</tr>
	);
};
