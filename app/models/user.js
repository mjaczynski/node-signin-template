'use strict';

var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    Promise = require('promise'),
    uuid = require('uuid'),
    moment = require('moment');

var userSchema = new mongoose.Schema({
    firstname   : {
        type: String
    },
    lastname    : {
        type: String
    },
    email       : {
        type: String,
    },
    username    : {
        type: String,
        unique: true
    },
    password    :  {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    resetkey: {
        type: String,
        unique: true,
        sparse : true
    },
    resetkeyTimeout: {
        type: Date
    },
    provider: {
        type: String
    },
    providerId: String,
    providerData: {},
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateResetKey = function() {
    this.resetkey= uuid.v4();
    this.resetkeyTimeout = moment().add(2,'h');
    return this;
};

module.exports = mongoose.model('User', userSchema);