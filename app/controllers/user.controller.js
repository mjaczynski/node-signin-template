
var winston = require('winston');

var config = require('../../config/config'),
    User	= require('../models/user'),
    email   = require('./email.controller');


module.exports.sendWelcome=function(req, res, next) {
    email.sendWelcome(req.user);
    res.status(200).send();
}

module.exports.postRegister=function(req, res, next) {

  req.assert('firstname', 'First name is required').notEmpty();
  req.assert('lastname', 'Last name is required').notEmpty();
  req.assert('username', 'Username is required').notEmpty();
  req.assert('username', 'Username must be 8 to 50 characters').len(8,50);
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be 8 to 20 characters').len(8,20);

  var errors = req.validationErrors();

  if (errors) {
      return res.status(400).send(errors);
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
            return res.status(400).send([{
                msg: 'Username already taken',
                param: 'username'
            }]);
        } else {
          return newUser.save()
                        .then(function (user){
                          winston.info("Username %s created",req.body.username);
                          req.logIn(user, function(err) {
                            if (err) return next(err);
                            email.sendWelcome(user);
                            res.status(200).send();
                          })
                        })
        }
      }).onReject(next);
};


module.exports.validateUsername=function(req, res, next) {
    console.log(req.query);
    User.findOne({ 'username' :  req.query.username }).exec()
        .then( function (user){
            if (user) {
               return res.status(400).send([{
                    msg: 'Username already taken',
                    param: 'username'
                }]);
            } else {
                res.status(200).send();
            }
        }).onReject(next);
};

module.exports.getLogout= function (req, res) {
  req.logout();
  res.redirect('/');
};


module.exports.postProfile= function (req, res, next) {

    // validate input
    req.assert('firstname', 'First name is required').notEmpty();
    req.assert('lastname', 'Last name is required').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    // replace existing property
      var user = req.user;
      user.firstname=req.body.firstname;
      user.lastname=req.body.lastname;
      user.email= req.body.email;
      user.save().then(function() {
            res.status(200).send();
      }).onReject(next);
};

module.exports.postPassword= function (req, res, next) {
    
    
    // validate input
    req.assert('oldpassword', 'Oldpassword is required').notEmpty();
    req.assert('password', 'Password is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    var user = req.user;
    if (!user.validPassword(req.body.oldpassword)){
        return res.status(400).send([{
            msg: 'Old password does not match.',
            param: 'oldpassword'
        }]);
    }
    
    // replace existing property
    user.password=user.generateHash(req.body.password);
    user.save().then(function() {
        res.status(200).send();
    }).onReject(next);
};

module.exports.getProfile= function (req, res, next) {
    var user = req.user;
    if (user) {
        res.status(200).send({
            firstname : user.firstname,
            lastname : user.lastname,
            username : user.username,
            email : user.email
        });
    } else {
        res.status(204).send();
    }
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
              var resetURL = req.protocol + '://' + req.get('host') + "/#!/reset?key=" + user.resetkey;
              return email.sendPasswordReset(user,resetURL);
            });
      })
      .onReject(winston.warn);

  // no need to wait anything, we return
  res.status(200).send();

};

module.exports.postReset= function (req, res, next) {
    req.assert('key', 'key is required').notEmpty();
    req.assert('password', 'Password must be 8 to 20 characters').len(8,20);

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }


  var key = req.body.key;
  User.findOne({'resetkey':key}).exec()
      .then(function(user){
        if (user==null) {
          winston.info("Reset link refused, user not found for key %s",key);
          return res.status(400).send([{
                msg: 'User not found or reset link time out',
                param: 'key'
          }]);
        }

        user.password = user.generateHash(req.body.password);
        user.resetkey=null;
        user.resetkeyTimeout=null;

        winston.info("Changing password for user %s",user.username);
        return user.save()
                  .then( function(user){
                    winston.info("Password changed for user %s",user.username);
                    return res.status(200).send();
                  })

      }).onReject(function(err){
          if (err.name=='MongoError'){
              winston.warn(err.errmsg);
          }
          console.log(err);
          return res.status(400).send();
      });
};

module.exports.postSendusername=function (req, res, next) {
    User.find({'email' : req.body.email}).exec()
        .then(function (users) {
            if (users == null) {
                return null;
            }
            return email.sendUsername(req.body.email,users);
        })
        .onReject(winston.warn);

    // no need to wait anything, we return
    res.status(200).send();

};




