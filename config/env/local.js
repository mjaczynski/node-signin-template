'use strict';

var winston = require('winston');

module.exports.configure = function (config) {
    winston.info('Configuring local deployment');
    
    return config;

};
