var EventEmitter = require('events').EventEmitter;
var range = require('lodash.range');

var Column = require('../models/Column');
var Row = require('../models/Row');

class MockGridDataSource extends EventEmitter {
	constructor(numColumns, numRows,
		{
			headerColumnWidth,
			columnWidth,
			updateInterval = null,
			rowUpdateProbability = 0,
			cellUpdateProbability = 0
		} = {}
	) {
		super();
		let columnNames = getColumnNames(numColumns);
		this.columns = createColumns(columnNames, columnWidth, headerColumnWidth);
		this.rows = createRows(numRows, this.columns);
		if (updateInterval) {
			setInterval(() => {
				this.rows = getUpdatedRows(this.columns, this.rows, rowUpdateProbability, cellUpdateProbability);
				this.emit('update', this.rows);
			}, updateInterval);
		}
	}

	getRows() {
		return this.rows;
	}

	getColumns() {
		return this.columns;
	}
}

function getUpdatedRows(columns, rows, rowUpdateProbability, cellUpdateProbability) {
	rows.filter((row) => Math.random() < rowUpdateProbability)
		.forEach((row) => {
			let rowModel = columns
				.slice(1)
				.filter((column) => Math.random() < cellUpdateProbability)
				.reduce((rowModel, column) => {
					rowModel[column.id] = generateRandomInt(0, 100);
					return rowModel;
				}, row.model);
			return new Row(rowModel);
		});
	return rows.slice();
}

function getColumnNames(numColumns) {
	return range(numColumns).map((index) => {
		return getIndexName(index);
	});
}

function createColumns(columnNames, columnWidth, headerColumnWidth = columnWidth) {
	let labelColumn = new Column({
		label: null,
		width: headerColumnWidth,
		sticky: true
	});
	return [labelColumn].concat(columnNames.map((columnName) => {
		return createColumn(columnName, columnWidth);
	}));
}

function createRows(numRows, columns) {
	return range(numRows).map((index) => {
		return createRow(columns, index);
	});
}

function createColumn(columnName, columnWidth) {
	let label = columnName;
	return new Column({
		label: label,
		width: columnWidth
	});
}

function createRow(columns, index) {
	let model = createRowModel(columns, index);
	let row = new Row(model);
	return row;
}

function createRowModel(columns, rowIndex) {
	return columns.reduce((model, column, columnIndex) => {
		if (columnIndex === 0) {
			model[column.id] = rowIndex + 1;
		} else {
			model[column.id] = generateRandomInt(0, 100);
		}
		return model;
	}, {});
}

function generateRandomInt(min, max) {
	return Math.round(min + Math.random() * Math.floor(max - min + 1));
}

function getIndexName(index) {
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let dividend = index + 1;
	let name = '';

	while (dividend > 0) {
		let modulo = (dividend - 1) % characters.length;
		name = characters.charAt(modulo) + name;
		dividend = Math.floor((dividend - modulo) / 26);
	}
	return name;
}

module.exports = MockGridDataSource;
