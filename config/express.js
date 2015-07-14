'use strict';

var winston = require('winston');

var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	flash = require('express-flash'),
	passport = require('passport'),
	cookieParser = require('cookie-parser'),
	connectMongo = require('connect-mongo'),
	expressValidator = require('express-validator');

module.exports = function(db) {

	var app = express();

	if (config.dev) {
		app.use(morgan('dev'));
	}

	app.use(compress());

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json());
	app.use(expressValidator());
	app.use(methodOverride());
	app.use(cookieParser());
	app.use(flash());

	winston.info("Using Mongo session store at %s",config.db);
	var MongoSessionStore = connectMongo(session);
	app.use(session({
		secret: config.sessionSecret,
		saveUninitialized: true,
		resave: true,
		store : new MongoSessionStore({  url: config.db })
	}));

    winston.info("Using passport session");
	app.use(passport.initialize());
	app.use(passport.session());

	// make the user available to views
	app.use(function(req,res,next){
		res.locals.user = req.user;
		next();
	});

	var userRouter = require('../app/routes/user.routes.js');
	app.use('/', userRouter);

	var indexRouter = require('../app/routes/index.routes.js');
	app.use('/', indexRouter);

	app.set('views','./app/views');
	app.set('view engine', 'jade');

	app.use(express.static('./public'));

	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: config.dev?err:{}
		});
	});

	return app;
};