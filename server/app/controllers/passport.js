// load up the instagram strategy
var InstagramStrategy = require('passport-instagram').Strategy;

var config = require('../../config');
var usersController = require('./users');
var User = require('../models/user');

function initialize(passport) {

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
  }, usersController.getOrCreateUser));
}

module.exports.initialize = initialize;
