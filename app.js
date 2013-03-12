var config = require('./config'),

    express = require('express'),
    passport = require('passport'),

    GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

var app = express();

passport.use(new GoogleStrategy({
    consumerKey: config.googleApi.consumerKey,
    consumerSecret: config.googleApi.consumerSecret,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(token, tokenSecret, profile, done) {
    /*
     * do the login somehow..... WIP <_<
     */
  }
));

app.configure(function() {
  app.use(passport.initialize());
});

app.get('/', function(req, res){
  var body = '<html><body><a href="/auth/google">Google</a></body></html>';
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.get('/auth/google', passport.authenticate('google'));

app.listen(3000);
console.log('Listening on port 3000');

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});
