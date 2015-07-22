'use strict';
var winston = require('winston');

var config = require('../../config/config'),
    Promise = require('promise'),
    sendgrid = require("sendgrid")(config.email.user, config.email.key);

var EmailTemplate = require('email-templates').EmailTemplate;


module.exports.sendPasswordReset = function (user,resetURL){
    var template = new EmailTemplate(__dirname+'/../views/emails/resetpassword');
    return template.render({user : user, config : config, resetURL:resetURL}).then(function(formatted) {
        return new Promise(function (resolve, reject) {
            sendgrid.send({
                to: user.email,
                from: config.email.from,
                subject: 'Reset your ' + config.name + ' password',
                text: formatted.text,
                html: formatted.html
            }, function (err, json) {
                if (err) {
                    winston.warn("Password Reset email not sent to %s", user.email);
                    return reject(err);
                }
                winston.info("Password Reset email sent to %s with link %s", user.email, resetURL);
                resolve(user);
            });
        });
    });
};

module.exports.sendWelcome = function (user){
    console.log("here2 "+user);
    var template = new EmailTemplate(__dirname+'/../views/emails/welcome');
    return template.render({user : user, config : config}).then(function(formatted) {
        return new Promise(function (resolve, reject) {
            sendgrid.send({
                to: user.email,
                from: config.email.from,
                subject: 'Thank you for registering to '+config.name,
                text: formatted.text,
                html: formatted.html
            }, function (err, json) {
                if (err) {
                    winston.warn("Registration email not sent to %s", user.email);
                    return reject(err);
                }
                winston.info("Registration email sent to %s", user.email);
                resolve(user);
            });
        });
    });
};

module.exports.sendUsername = function (email, users){
    var template = new EmailTemplate(__dirname+'/../views/emails/username');
    return template.render({users : users, config : config}).then(function(formatted) {
        return new Promise(function (resolve, reject) {
            sendgrid.send({
                to: email,
                from: config.email.from,
                subject: 'Recover your ' + config.name + ' username',
                text: formatted.text,
                html: formatted.html
            }, function (err, json) {
                if (err) {
                    winston.warn("Recover username email not sent to %s", email);
                    return reject(err);
                }
                winston.info("Recover username email sent to %s", email);
                resolve(email);
            });
        });
    });
};