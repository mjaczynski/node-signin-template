'use strict';

var winston = require('winston');

var passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	config = require('../config'),
	User = require('../../app/models/user');

module.exports = function() {

	passport.use(new GoogleStrategy({
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			User.findOne({
				provider: profile.provider,
				providerId: profile.providerId
			}).exec()
			.then(function (user) {
				if (user) {
					return done(null, user);
				}
				var providerData = profile._json;
				providerData.accessToken = accessToken;
				providerData.refreshToken = refreshToken;
				user = new User({
					firstname: profile.name.givenName,
					lastname: profile.name.familyName,
					email: profile.emails[0].value,
					username: profile.provider+'-'+profile.id,
					provider: profile.provider,
					providerId: profile.id,
					providerData: providerData
				});
				return user.save().then(function (user) {
					winston.info("Signup accepted for user %s",username);
					done(null, user);
				})
			})
			.onReject(done);

		}));
};