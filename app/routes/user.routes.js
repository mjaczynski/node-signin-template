'use strict';

var config = require('../../config/config'),
    express  = require('express'),
    passport = require('passport'),
    User	= require('../models/user'),
    email   = require('../controllers/email.controller'),
    users   = require('../controllers/user.controller');

var router = express.Router();

router.route('/signin')
    .get(users.getSignin)
    .post(passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/signin',
    }));

router.route('/signup')
    .get(users.getSignup)
    .post(users.postSignup);

router.route('/logout')
    .get(users.getLogout);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

router.use('/profile',isLoggedIn);

router.route('/profile')
    .get(users.getProfile)
    .post(users.postProfile);

router.route('/sendreset')
    .get(users.getSendreset)
    .post(users.postSendreset);

router.route('/reset')
    .get(users.getReset)
    .post(users.postReset);

router.route('/auth/google').get(passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ],
    failureRedirect: '/signin'
}));

router.route('/auth/google/callback').get(passport.authenticate('google', {
    failureRedirect: '/signin',
    successRedirect: '/'
}));

module.exports = router;


