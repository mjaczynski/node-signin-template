'use strict';

// Returns common defaults for configuration
module.exports = {
    name : "User Demo",
    db: 'mongodb://localhost/users',
    sessionSecret: 'secret',
    dev : true,
    port : 3000,
    email : {
        user : process.env.CONFIG_SENDGRID_USER || 'UNDEFINED_SENDGRID_USER',
        key : process.env.CONFIG_SENDGRID_KEY || 'UNDEFINED_SENDGRID_KEY',
        from : "mycloudtips@gmail.com"
    },
    google: {
        clientID: process.env.CONFIG_GOOGLE_CLIENTID || 'UNDEFINED_GOOGLE_CLIENTID',
        clientSecret: process.env.CONFIG_GOOGLE_CLIENTSECRET || 'UNDEFINED_GOOGLE_CLIENTSECRET',
        callbackURL: process.env.CONFIG_GOOGLE_CALLBACK || 'UNDEFINED_GOOGLE_CALLBACK'
    }
};