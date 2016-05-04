// load up the instagram strategy
var InstagramStrategy = require('passport-instagram').Strategy;

// load up the user model
var User = require('../models/user');
var config = require('../../config');

module.exports = function(passport) {

  passport.serializeUser(function(user, callback) {
    callback(null, user.id);
  });

  passport.deserializeUser(function(userId, callback) {
    User.findById(userId, function(err, user) {
      callback(err, user);
    });
  });

  passport.use(new InstagramStrategy({
    clientID: config.auth.instagram.clientID,
    clientSecret: config.auth.instagram.clientSecret,
    callbackURL: config.auth.instagram.callbackURL
  }, function(token, refreshToken, profile, callback) {

    process.nextTick(function() {
      User.findOne({
        'instagram.id': profile.id
      }, function(err, user) {
        if (err) {
          return callback(err);
        }

       if (user) {
         return callback(null, user);
       } else {
          var newUser = new User();
          newUser.instagram.id = profile.id;
          newUser.instagram.token = token;
          newUser.instagram.name = profile.displayName; // look at the passport user profile to see how names are returned
          newUser.instagram.username = profile.username;
          newUser.instagram.profilePicture = profile._json.data.profile_picture;

          newUser.save(function(err) {
            if (err) {
              throw err;
            }

            return callback(null, newUser);
          });
        }
      });
    });
  }));
}
