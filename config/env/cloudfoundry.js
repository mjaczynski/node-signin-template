'use strict';

var winston = require('winston');

var cfenv = require("cfenv");

// indicates if cloudfoundry is detected
module.exports.detect = function (){
    if (process.env.VCAP_SERVICES){
        return true;
    } else {
        return false;
    }
};

// override configuration with CF services
module.exports.configure = function (config) {
    winston.info('Configuring cloudfoundry deployment');
    var appEnv   = cfenv.getAppEnv();

    config.port = appEnv.port;

    var mongo = appEnv.services.mongolab[0];
    config.db = mongo.credentials.uri;

    var sendgrid = appEnv.services.sendgrid[0];
    config.email.user=sendgrid.credentials.username;
    config.email.key= sendgrid.credentials.password;
    return config;
};
