var User = require('../models/user');
var PoolDA = require('../data_access/pool');
var UserDA = require('../data_access/user');
var mediaTypeMapper = require('../models/media_type_mapper');

var request = require('request');

function getNextCandidate(req, res, next) {

  var user = new User(req.user);

  PoolDA.getNextCandidate(user, function (err, poolUser) {

    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(poolUser);
    }

  });

}

function refuseCandidate(req, res, next) {
  var user = new User(req.user);

  var refusedUserId = req.body.refusedUserId;

  var params = {
    currentUser: user,
    refusedUserId: refusedUserId
  };

  PoolDA.refuseCandidate(params, function (err, success) {

    if (err) {
      console.log('error: ', err);
      res.status(400).send(err);
    } else {
      res.status(201).send({
        status: 'success'
      });
    }
  });
}

function approveCandidate(req, res, next) {

  // TODO: Check if users already follow each other on instagram

  var user = new User(req.user);
  var approvedUserId = req.body.approvedUserId;

  var params = {
    currentUser: user,
    approvedUserId: approvedUserId
  };

  PoolDA.approveCandidate(params, function (err, success) {
    if (err) {
      console.log('error: ', err);
      res.status(400).send(err);
    } else {

      var userMatchParams = {
        usersId: approvedUserId,
        shownUsersId: user.id
      };

      // check is users followed each other
      PoolDA.getIsFollowed(userMatchParams, function (err, success) {
        if (err) {
          if (err.message && err.message.indexOf('Relationship does not exist') > -1) {
            res.status(201).send('created first relationship: ' + success);
          } else {
            console.log('error: ', err);
            res.status(400).send(err);
          }

        } else {
          var params = {
            id: approvedUserId,
            socialMediaType: mediaTypeMapper.instagram
          };

          // get access token of the second user
          UserDA.findUserById(params, function (err, secondUser) {
            if (err) {
              console.log('err: ', err);
              res.status(400).send('Unable to get second user by id: ' + err);
            } else {
              var firstFollowParams = {
                followerAccessToken: user.accessToken,
                userIdToFollow: secondUser.social_id
              };

              createFollowRelationship(firstFollowParams, function (err, callback) {
                if (err) {
                  console.log('err: ', err);
                  res.status(400).send('Unable to create first relationship between users: ' + err);
                } else {

                  var secondFollowParams = {
                    followerAccessToken: secondUser.accessToken,
                    userIdToFollow: user.socialId
                  };

                  // create second relationship
                  createFollowRelationship(secondFollowParams, function (err, result) {
                    if (err) {
                      console.log('err: ', err);
                      res.status(400).send('Unable to create second relationship between users: ' + err);
                    } else {
                      res.status(201).send('Users followed each other');
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

function createFollowRelationship(params, callback) {
  var igFollowApiUri = 'https://api.instagram.com/v1/users/USER-ID/relationship?access_token=ACCESS-TOKEN';
  igFollowApiUri = igFollowApiUri.replace('USER-ID', params.userIdToFollow);
  igFollowApiUri = igFollowApiUri.replace('ACCESS-TOKEN', params.followerAccessToken);

  var data = {
    action: 'follow'
  };

  request.post(igFollowApiUri, data, function (err, response, body) {
    if (err) {
      callback(err);
    } else {
      console.log('response: ', response);
      console.log('body: ', body);
      if (body && body.meta & body.meta.error_message) {
        callback({ message: body.meta.error_message });
      } else {
        callback();
      }
    }
  });
}

exports.getNextCandidate = getNextCandidate;
exports.refuseCandidate = refuseCandidate;
exports.approveCandidate = approveCandidate;