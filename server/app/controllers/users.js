var config = require('../../config');
var UserDA = require('../data_access/user');
var mediaTypeMapper = require('../models/media_type_mapper');

// models
var User = require('../models/user');
var SocialMedia = require('../models/social_media');
var ResponseUser = require('../models/response_user');

var request = require('request');

function getUsers(req, res, next) {
  UserDA.getAllUsers(function (err, users) {

    if (err) {
      res.status(400).send(err);
    } else {
      var responseUsers = [];
      for (var i = 0; i < users.length; i++) {
        responseUsers.push(new ResponseUser(users[i]));
      }

      res.json(responseUsers);
    }
  });
}

function getOrCreateUser(token, refreshToken, profile, callback) {
  process.nextTick(function () {

    var params = {
      socialId: profile.id,
      socialMediaType: mediaTypeMapper.instagram
    };

    UserDA.findUserBySocialId(params, function (err, result) {

      if (err) {
        callback(err);
      } else {
        if (result.length) {
          callback(null, result[0]);
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

            UserDA.createUser(newUser, function (err, result) {
              if (err) {
                callback(err);
              } else {
                if (!result.length) {
                  callback('Unable to find user after it was created');
                } else {
                  callback(null, result[0]);
                }
              }
            });
          });
        }
      }
    });
  });
}

function getUserProfile(req, res, next) {
  var responseUser = new ResponseUser(req.user);
  res.json(responseUser);
}

function getUserMedia(req, res, next) {

  var socialMedia = new SocialMedia(req);

  if (!socialMedia.validator.state.isValid) {
    res.status(400).send(socialMedia.validator.state.message);
  } else {

    var params = {
      id: socialMedia.userId,
      socialMediaType: socialMedia.socialMediaType
    }

    UserDA.findUserById(params, function (err, result) {

      if (err) {
        res.status(400).send(err);
      } else {

        if (!result.length) {
          res.status(400).send('Unable to find specified user in DB');
        } else {

          var user = new User(result[0]);

          var igUserMediaApiUri = 'https://api.instagram.com/v1/users/USER-ID/media/recent/?access_token=ACCESS-TOKEN';
          igUserMediaApiUri = igUserMediaApiUri.replace('USER-ID', user.socialId);
          igUserMediaApiUri = igUserMediaApiUri.replace('ACCESS-TOKEN', user.accessToken);

          request(igUserMediaApiUri, function (err, igMediaResponse, body) {
            if (err) {
              res.status(400).send(err);
            } else {

              var parsedIgMediaResponse = null;
              try {
                parsedIgMediaResponse = JSON.parse(body);
              } catch (ex) { }

              if (!parsedIgMediaResponse || !parsedIgMediaResponse.data) {
                res.status(400).send('Unable to get Instagram media for the specified user');
              } else {
                res.status(200).send(parsedIgMediaResponse.data);
              }
            }
          });
        }
      }
    });
  }
}

exports.getUserProfile = getUserProfile;
exports.getUsers = getUsers;
exports.getOrCreateUser = getOrCreateUser;
exports.getUserMedia = getUserMedia;

