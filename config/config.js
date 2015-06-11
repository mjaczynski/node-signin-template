'use strict';

var winston = require('winston');

var envname = 'local';

if (process.env.VCAP_SERVICES){
    envname = 'bluemix';
}

winston.info('Setting config to %s',envname);

module.exports = require('./env/'+envname);