'use strict';
var winston = require('winston');

var LocalStrategy   = require('passport-local').Strategy,
	User       		= require('../../app/models/user'),
	passport        = require('passport');

module.exports = function() {
	passport.use('local', new LocalStrategy({
			usernameField : 'username',
			passwordField : 'password',
			passReqToCallback : true
		},
		function(req, username, password, done) {
			User.findOne({ 'username' :  username }).exec()
				.then( function(user) {
					if (!user) {
						winston.info("Signin rejected, user %s does not exists",username);
						req.flash('errors', { msg:  'Username does not exists'});
						return done(null, false, req);
					}

					if (!user.validPassword(password)) {
						winston.info("Signin rejected, password does not match for %s",username);
						req.flash('errors', { msg:  'Password does not match'});
						return done(null, false, req );
					}

					return done(null, user);
				})
				.onReject(done)
		}));
};