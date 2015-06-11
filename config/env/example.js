'use strict';

module.exports = {
    db: 'mongodb://localhost/users',
    sessionSecret: 'secret',
    dev : true,
    port : 3000,
    email : {
        user : "__sendgrid_user__",
        key : "__sendgrid_password__",
        from : "myemail@gmail.com"
    },
    google: {
        clientID: '__google_client__id__',
        clientSecret: '__google_client_secret__',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    }
};