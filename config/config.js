'use strict';

var winston = require('winston');

var cloudfoundry = require('./env/cloudfoundry'),
    openshift = require('./env/openshift'),
    local = require('./env/local'),
    config = require('./env/defaults');

var env;
if (cloudfoundry.detect()){
    env = cloudfoundry;
} else if (openshift.detect()){
    env = openshift
} else {
    env = local;
}

module.exports=env.configure(config);


