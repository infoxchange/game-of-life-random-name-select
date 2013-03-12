var express = require('express'),
    passport = require('passport'),

    GoogleStrategy = require('passport-google').Strategy;

var app = express();

passport.use(new GoogleStrategy({
    returnURL: 'http://ix.org.au/loginSuccess',
    realm: 'ix.org.au'
  },
  function(identifier, profile, done) {
    /*
     * do the login somehow..... WIP <_<
     */
  }
));

app.configure(function() {
  app.use(passport.initialize());
});

app.get('/', function(req, res){
  var body = '<html><body><a href="/login/google">Google</a></body></html>';
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.get('/login/google', passport.authenticate('google'));

app.listen(3000);
console.log('Listening on port 3000');

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});
