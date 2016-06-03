// load up the instagram strategy
var InstagramStrategy = require('passport-instagram').Strategy;

var config = require('../../config');
var usersController = require('./users');
var UserDA = require('../data_access/user');
var mediaTypeMapper = require('../models/media_type_mapper');

function initialize(passport) {

  passport.serializeUser(function(user, callback) {
    callback(null, user.social_id);
  });

  passport.deserializeUser(function(userSocialId, callback) {
    var params = {
      socialId: userSocialId,
      socialMediaType: mediaTypeMapper.instagram
    };
    UserDA.findUserBySocialId(params, function(err, user) {
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
