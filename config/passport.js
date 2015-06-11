'use strict';

var User       		= require('../app/models/user'),
    passport        = require('passport');

module.exports = function() {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, done);
    });

    require('./strategies/local.js')();
    require('./strategies/google.js')();

};
