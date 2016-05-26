var config = require('../../config');
var User = require('../models/user');
var UserDA = require('../data_access/user');

function getUsers(req, res, next) {
  User.find({}, function(err, users) {

    if (err) {
      return next(err);
    }

    res.json(users);
  });
}

function getOrCreateUser(token, refreshToken, profile, callback) {
  process.nextTick(function() {

    UserDA.findOne(profile.id,  function(err, user) {

      if (err) {
        return callback(err);
      }

      if (user) {
        return callback(null, user);
      } else {

        var params = {
          id: profile.id,
          accesToken: token,
          isActive: true,
          username: profile.username,
          profilePicture: profile._json.data.profile_picture,
          socialMediaType: "instagram"
        };

        var newUser = new User(params);

        UserDA.createUser(newUser, function(err) {
          if (err) {
            throw err;
          }

          return callback(null, newUser);
        })
      }
    });
  });
}

function getUserProfile(req, res, next) {
  res.json({user: req.user});
}

exports.getUserProfile = getUserProfile;
exports.getUsers = getUsers;
exports.getOrCreateUser = getOrCreateUser;
