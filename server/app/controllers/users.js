var config = require('../../config');
var User = require('../models/user');
var UserDA = require('../data_access/user');
var mediaTypeMapper = require('../models/media_type_mapper');

function getUsers(req, res, next) {
  UserDA.getAllUsers(function (err, users) {

    if (err) {
      res.status(400).send(err);
    } else {
      res.json(users);
    }
  });
}

function getOrCreateUser(token, refreshToken, profile, callback) {
  process.nextTick(function () {

    var params = {
      socialId: profile.id,
      socialMediaType: mediaTypeMapper.instagram
    };

    UserDA.findUserBySocialId(params, function (err, user) {

      if (user) {
        callback(null, user);
      } else {

        UserDA.createAccount(function (account) {

          var params = {
            social_id: profile.id,
            user_name: profile.username,
            profile_picture: profile._json.data.profile_picture,
            social_media_type_id: mediaTypeMapper.instagram,
            access_token: token,
            is_active: true,
            account_id: account.insertId
          };

          var newUser = new User(params);

          UserDA.createUser(newUser, function (err, createdUser) {
            if (err) {
              callback(err);
            } else {
              callback(null, createdUser);
            }
          });
        });
      }
    });
  });
}

function getUserProfile(req, res, next) {
  res.json({
    user: req.user
  });
}

exports.getUserProfile = getUserProfile;
exports.getUsers = getUsers;
exports.getOrCreateUser = getOrCreateUser;
