'use strict';

var React = require('react');

var MainApp = require('./apps/MainApp');
var MockGridDataSource = require('./services/MockGridDataSource');

var numColumns = 10;
var numRows = 100;

var appProps = {
	gridDataSource: new MockGridDataSource(numColumns, numRows, {
		headerColumnWidth: 50,
		columnWidth: 80
	})
};

var app = React.createElement(MainApp, appProps);
var parentElement = global.document.querySelectorAll('[role="main"]')[0];

React.render(app, parentElement);
