var config = require('./config'),
    passport = require('passport'),

    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;



/*****************
 * Help
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

/*****************
 * Setup
 */
passport.use(new GoogleStrategy({
    clientID: config.googleApi.clientID,
    clientSecret: config.googleApi.clientSecret,
    callbackURL: config.baseURL + '/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

passport.serializeUser(function(user, done) {
  var email;
  if ("emails" in user) {
    email = user.emails[0].value;
  }
  done(null, {
    displayName: user.displayName,
    name: user.name,
    email: email
  });
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function setupRoutes(app) {
  /*****************
   * All
   */
  app.get('/account', ensureAuthenticated, function(req, res){
    res.redirect('/#' + req.user.email)
  });
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/account');
  });

  /*****************
   * GOOGLE
   */
  app.get('/auth/google', passport.authenticate('google', 
    {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }
  ));

  app.get('/auth/google/callback', passport.authenticate(
      'google',
      { failureRedirect: '/auth/failed.html' }
    ),
    function(req, res) {
      res.redirect('/account')
    }
  );
}

/*****************
 * Exports
 */
module.exports = {
  ensureAuthenticated: ensureAuthenticated,
  setupRoutes: setupRoutes
}
