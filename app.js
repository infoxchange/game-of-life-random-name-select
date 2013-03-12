var config = require('./config'),

    express = require('express'),
    passport = require('passport'),

    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var app = express();

passport.use(new GoogleStrategy({
    clientID: config.googleApi.clientID,
    clientSecret: config.googleApi.clientSecret,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(token, tokenSecret, profile, done) {
    /*
     * do the login somehow..... WIP <_<
     */
  }
));

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.session({ secret: config.cookieSecret }));
  app.use(passport.initialize());
  app.use(passport.session());
});

app.use(express.static(__dirname + '/public'));

app.get('/auth/google', passport.authenticate('google'));

app.listen(3000);
console.log('Listening on port 3000');

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});
