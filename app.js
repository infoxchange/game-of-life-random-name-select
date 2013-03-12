var config = require('./config'),

    express = require('express'),
    passport = require('passport'),

    auth = require('./auth'),
    imgimport = require('./imgimport'),
    worker = require('./worker');

var app = express();

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.session({ secret: config.cookieSecret }));
  app.use(passport.initialize());
  app.use(passport.session());
});

app.use(express.static(__dirname + '/public'));

auth.setupRoutes(app);

app.get('/participate', function (req, res) {
  var email = req.user.email;
  imgimport.importGravatar(email, function (data) {
    worker.addJob({ user: email, data: data });
    worker.run();
  });
  res.end('');
});

app.get('/me', function (req, res) {
  var data = worker.last(req.user.email);
  res.end(JSON.stringify(data));
});

app.get('/all', function (req, res) {
  var data = worker.all();
  res.end(JSON.stringify(data));
});

app.listen(config.port);
console.log('Listening on port ' + config.port);

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});
