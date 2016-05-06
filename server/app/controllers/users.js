var config = require('../../config');
var User = require('../models/user');

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
}

function getUserProfile(req, res, next) {
  res.json({user: req.user});
}

exports.getUserProfile = getUserProfile;
exports.getUsers = getUsers;
exports.getOrCreateUser = getOrCreateUser;
