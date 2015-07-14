'use strict';

var winston = require('winston');

// indicates if openshift is detected
module.exports.detect = function (){
    if (process.env.OPENSHIFT_GEAR_NAME){
        return true;
    } else {
        return false;
    }
};

// override configuration with Openshift services
module.exports.configure  = function (config) {
    winston.info('Configuring openshift deployment');
    winston.info('Application %s on %s', process.env.OPENSHIFT_GEAR_NAME, process.env.OPENSHIFT_GEAR_DNS );
    winston.info('Node.js engine is %s', process.env.OPENSHIFT_NODEJS_VERSION);
    winston.info('Memory limit is %s',  process.env.OPENSHIFT_GEAR_MEMORY_MB);

    config.port = process.env.OPENSHIFT_NODEJS_PORT;
    config.ip=process.env.OPENSHIFT_NODEJS_IP;

    config.db = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/' + process.env.OPENSHIFT_APP_NAME;
    return config;
};

