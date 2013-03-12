var config = require('./config'),
    passport = require('passport'),

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
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(token, tokenSecret, profile, done) {
    /*
     * do the login somehow..... WIP <_<
     */
  }
));

function setupRoutes(app) {
  /*****************
   * All
   */
  app.get('/account', ensureAuthenticated, function(req, res){
    console.dir({user:res.user})
    res.redirect('/#' + res.user)
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
      { failureRedirect: '/auth/failed' }
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
