#!/usr/bin/env node

'use strict';

var winston = require('winston');
winston.info('Server initialization started');
winston.profile('Server startup');

var config = require('./config/config'),
    mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    passport = require('./config/passport'),
    http = require('http');


var db = mongoose();

var app = express(db);

passport();

app.set('port', config.port);

var server = http.createServer(app);

if (config.ip){
  winston.info("listen on port %s IP %s",config.port, config.ip)
  server.listen(config.port, config.ip);
} else {
  winston.info("listen on port %s",config.port)
  server.listen(config.port);
}

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof config.port === 'string'
    ? 'Pipe ' + config.port
    : 'Port ' + config.port;

  switch (error.code) {
    case 'EACCES':
      winston.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      winston.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  winston.profile('Server startup');
  winston.info('Server is ready on ' + bind);

}