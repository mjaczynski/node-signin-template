'use strict';

var winston = require('winston');

var	config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {

	winston.info("Connecting mongoose to %s",config.db);
	var db = mongoose.connect(config.db);

	require('../app/models/user');

	return db;
};