
var winston = require('winston');

var config = require('../../config/config'),
    User	= require('../models/user'),
    email   = require('./email.controller');


module.exports.getSignin= function (req, res, next) {
  res.render('signin');
};

module.exports.getSignup=function (req, res, next) {
  res.render('signup');
};

module.exports.postSignup=function(req, res, next) {

  req.assert('firstname', 'First name is required').notEmpty();
  req.assert('lastname', 'Last name is required').notEmpty();
  req.assert('username', 'Username is required').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be 5 to 10 characters').len(5,10);
  req.assert('cpassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  var newUser = new User();
  newUser.username = req.body.username;
  newUser.password = newUser.generateHash(req.body.password);
  newUser.firstname = req.body.firstname;
  newUser.lastname = req.body.lastname;
  newUser.email = req.body.email;

  User.findOne({ 'username' :  req.body.username }).exec()
      .then( function (user){
        if (user) {
          winston.info("User creation refused, username %s already exists",req.body.username);
          req.flash('errors', { msg: 'That username is already taken.'});
          return res.redirect('/signup');
        } else {
          return newUser.save()
                        .then(function (user){
                          winston.info("Username %s created",req.body.username);
                          req.logIn(user, function(err) {
                            if (err) return next(err);
                            res.redirect('/');
                          })
                        })
        }
      })
      .onReject(next);
};


module.exports.getLogout= function (req, res) {
  req.logout();
  res.redirect('/');
};


module.exports.getProfile=function (req, res) {
  res.render('profile');
};

module.exports.postProfile= function (req, res, next) {
  var user = req.user;
  user.firstname=req.body.firstname;
  user.lastname=req.body.lastname;
  if (req.body.password) {
    user.password = user.generateHash(req.body.password);
  }
  user.email= req.body.email;
  user.save()
      .then(function() {
        res.redirect("/profile");
      })
      .onReject(next);
};

module.exports.getSendreset= function (req, res, next) {
  res.render('sendreset');
};

module.exports.postSendreset=function (req, res, next) {
  User.findOne({'username' : req.body.username}).exec()
      .then(function (user) {
        if (user == null) {
          return null;
        }
        user.generateResetKey();
        return user.save()
            .then(function (user) {
              var resetURL = req.protocol + '://' + req.get('host') + "/reset?key=" + user.resetkey;
              return email.sendPasswordReset(user,resetURL);
            });
      })
      .onReject(winston.warn);

  // no need to wait anything, we return
  res.redirect("/");

};

module.exports.getReset= function (req, res, next) {
  res.render('reset',{
    key : req.query.key
  });
};

module.exports.postReset= function (req, res, next) {
  var key = req.body.key;
  User.findOne({'resetkey':key}).exec()
      .then(function(user){
        if (user==null) {
          winston.info("Reset link refused, user not found for key %s",key);
          req.flash('errors', { msg: "User not found or reset link time out"});
          return res.redirect('/reset?key='+key);
        }

        user.password = user.generateHash(req.body.password);
        user.resetkey=null;
        user.resetkeyTimeout=null;

        return user.save()
                  .then( function(user){
                    winston.info("Password changed for user %s",user.username);
                    return res.redirect('/signin');
                  })

      })
      .onReject(next);

};




