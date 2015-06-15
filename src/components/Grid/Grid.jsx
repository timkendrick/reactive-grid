var React = require('react');

var GridRow = require('./GridRow');

module.exports = function() {
	let rows = this.props.rows;
	let columns = this.props.columns;

	let totalWidth = getTotalWidth(columns);

	let columnElements = (columns ? createColumnElements(columns) : null);
	let headerRowElements = (columns ? createHeaderRowElements(columns) : null);
	let bodyRowElements = (rows && columns ? (rows.length > 0 ? createBodyRowElements(rows, columns) : createEmptyRowElement(columns)) : (columns ? createLoadingRowElement() : null));

	return (
		<table className="Grid" style={{ width: totalWidth }}>
			<colgroup ref="columns">
				{ columnElements }
			</colgroup>
			<thead ref="header">
				{ headerRowElements }
			</thead>
			<tbody ref="body">
				{ bodyRowElements }
			</tbody>
		</table>
	);
};

function getTotalWidth(columns) {
	return columns.reduce((sum, column) => {
		return sum + column.width;
	}, 0);
}

function createColumnElements(columns) {
	return columns.map((column) => {
		return (
			<col key={ 'column-' + column.id } style={{ width: column.width }}/>
		);
	});
}

function createHeaderRowElements(columns) {
	return (
		<tr>
			{
				columns.map((column) => {
					return (
						<th key={ 'header-' + column.id }>{ column.label }</th>
					);
				})
			}
		</tr>
	);
}

function createBodyRowElements(rows, columns) {
	return rows.map((row) => {
		return (
			<GridRow
				key={ 'row-' + row.id }
				row={ row }
				columns={ columns }
			></GridRow>
		);
	});
}

function createEmptyRowElement(columns) {
	return (
		<tr>
			<td colSpan={ columns.length }>No results</td>
		</tr>
	);
}

function createLoadingRowElement(columns) {
	return (
		<tr>
			<td>Loading…</td>
		</tr>
	);
}
