'use strict';

var config = require('../../config/config'),
    express  = require('express'),
    passport = require('passport'),
    User	= require('../models/user'),
    email   = require('../controllers/email.controller'),
    users   = require('../controllers/user.controller');

var router = express.Router();

router.route('/users/util/login')
    .post(passport.authenticate('local'),
          users.getProfile);

router.route('/users/util/register')
    .post(users.postRegister);

router.route('/users/util/validate')
    .get(users.validateUsername);

router.route('/users/util/logout')
    .get(users.getLogout);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.status(401).send();
}

router.use('/users/me',isLoggedIn);

router.route('/users/me/profile')
    .get(users.getProfile)
    .post(users.postProfile);

router.route('/users/me/password')
    .post(users.postPassword);

router.route('/users/util/sendreset')
    .post(users.postSendreset);

router.route('/users/util/sendusername')
    .post(users.postSendusername);

router.route('/users/util/reset')
    .post(users.postReset);

//router.route('/auth/google').get(passport.authenticate('google', {
//    scope: [
//        'https://www.googleapis.com/auth/userinfo.profile',
//        'https://www.googleapis.com/auth/userinfo.email'
//    ],
//    failureRedirect: '/signin'
//}));
//
//router.route('/auth/google/callback').get(passport.authenticate('google', {
//    failureRedirect: '/signin',
//    successRedirect: '/'
//}));

module.exports = router;


