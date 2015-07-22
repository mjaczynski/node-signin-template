'use strict';

var winston = require('winston');

module.exports.configure = function (config) {
    winston.info('Configuring local deployment');
    config.email = {
        user : "mjaczynski",
        key : "Jac70sge",
        from : "mycloudtips@gmail.com"
    };
    return config;

};
