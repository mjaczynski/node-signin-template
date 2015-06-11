'use strict';
var winston = require('winston');

var config = require('../../config/config'),
    Promise = require('promise'),
    sendgrid = require("sendgrid")(config.email.user, config.email.key);

module.exports.sendPasswordReset = function (user,resetURL){
    return new Promise (function (resolve, reject){
        sendgrid.send({
            to: user.email,
            from: config.email.from,
            subject: 'Password Reset Request',
            text: 'Click on ' + resetURL,
        }, function (err, json) {
            if (err) {
                winston.warn("Password Reset email not sent to %s", user.email);
                return reject(err);
            }
            winston.info("Password Reset email sent to %s with link %s", user.email, resetURL);
            resolve(user);
        });
    });
};

