var config = require('./config'),

    express = require('express'),
    passport = require('passport'),

    auth = require('./auth');

var app = express();

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.session({ secret: config.cookieSecret }));
  app.use(passport.initialize());
  app.use(passport.session());
});

app.use(express.static(__dirname + '/public'));

auth.setupRoutes(app);

app.listen(3000);
console.log('Listening on port 3000');

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});
