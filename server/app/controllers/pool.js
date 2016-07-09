var PoolDA = require('../data_access/pool');
var UserDA = require('../data_access/user');
var mediaTypeMapper = require('../models/media_type_mapper');

// models
var User = require('../models/user');
var RefuseCandidate = require('../models/refuse_candidate');
var ApproveCandidate = require('../models/approve_candidate');

var request = require('request');

function getNextCandidate(req, res, next) {

  var user = new User(req.user);

  PoolDA.getNextCandidate(user, function (err, result) {

    if (err) {
      res.status(400).send('Unable to get next candidate');
    } else {

      var responseUser = null;

      if (!result.length) {
        // if no next candidate - return user with id == -1
        responseUser = {
          id: -1
        };

      } else {
        var nextUser = new User(result[0]);
        responseUser = {
          id: nextUser.id,
          userName: nextUser.userName,
          profilePicture: nextUser.profilePicture,
          socialId: nextUser.socialId,
          socialMediaType: nextUser.socialMediaType,
          isActive: nextUser.isActive
        };
      }
      res.status(200).send(responseUser);
    }
  });

}

function refuseCandidate(req, res, next) {
  var user = new User(req.user);
  var refuseCandidate = new RefuseCandidate(req);

  // validate request params
  if (!refuseCandidate.validator.state.isValid) {
    res.status(400).send(refuseCandidate.validator.state.message);
  } else {

    var params = {
      currentUser: user,
      refusedUserId: refuseCandidate.refusedUserId
    };

    PoolDA.refuseCandidate(params, function (err, success) {

      if (err) {
        console.log('error: ', err);
        res.status(400).send('Unable to refuse candidate in DB');
      } else {
        res.status(201).send('Refused candidate');
      }
    });
  }
}

function approveCandidate(req, res, next) {

  // TODO: Check if users already follow each other on instagram

  var user = new User(req.user);
  var approveCandidate = new ApproveCandidate(req);

  // validate request params
  if (!approveCandidate.validator.state.isValid) {
    res.status(200).send(approveCandidate.validator.state.message);
  } else {

    var params = {
      currentUser: user,
      approvedUserId: approveCandidate.approvedUserId
    };

    // approve user you just got from getNextCandidate
    PoolDA.approveCandidate(params, function (err, success) {
      if (err) {
        console.log('error: ', err);
        res.status(400).send('Unable to approve candidate in DB');
      } else {

        var userMatchParams = {
          usersId: approveCandidate.approvedUserId,
          shownUsersId: user.id
        };

        // check is user you just approved - already approved you before
        PoolDA.getIsFollowed(userMatchParams, function (err, result) {
          if (err) {
            res.status(400).send('Unable to get IsFollowed from DB');
          } else {

            if (!result.length) {
              res.status(200).send('Created first relationship');
            } else {
              var params = {
                id: approveCandidate.approvedUserId,
                socialMediaType: mediaTypeMapper.instagram
              };

              // users have follow relationship with each other, going to actually create it on Instagram

              // get access token of the second user
              UserDA.findUserById(params, function (err, secondUserResult) {
                if (err || !secondUserResult.length) {
                  res.status(400).send('Unable to get second user by id');
                } else {

                  var secondUserObject = new User(secondUserResult[0]);

                  var firstFollowParams = {
                    followerAccessToken: user.accessToken,
                    userIdToFollow: secondUserObject.socialId
                  };

                  // current user to IG follow user they just 'followed' in our app
                  createFollowRelationship(firstFollowParams, function (err, callback) {
                    if (err) {
                      console.log('err: ', err);
                      res.status(400).send('Unable to create first relationship between users');
                    } else {

                      var secondFollowParams = {
                        followerAccessToken: secondUserObject.accessToken,
                        userIdToFollow: user.socialId
                      };

                      // create second relationship, the second user to IG follow current user
                      createFollowRelationship(secondFollowParams, function (err, result) {
                        if (err) {
                          console.log('err: ', err);
                          res.status(400).send('Unable to create second relationship between users ');
                        } else {
                          // everything worked out
                          res.status(201).send('Users followed each other');
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
  }
}

function createFollowRelationship(params, callback) {
  var igFollowApiUri = 'https://api.instagram.com/v1/users/USER-ID/relationship?access_token=ACCESS-TOKEN';
  igFollowApiUri = igFollowApiUri.replace('USER-ID', params.userIdToFollow);
  igFollowApiUri = igFollowApiUri.replace('ACCESS-TOKEN', params.followerAccessToken);

  request.post({
    url: igFollowApiUri, //URL to hit
    method: 'POST',
    form: {
      action: 'follow'
    }
  }, function (err, response, body) {
    if (err) {
      callback(err);
    } else {

      var res = JSON.parse(body);

      if (res && res.meta && res.meta.error_message) {
        callback({ message: resres.meta.error_message });
      } else if (res && res.meta && res.meta.code == 200) {
        callback(null, { status: 'success' });
      } else {
        callback(null, { status: 'failed' });
      }
    }
  });
}

exports.getNextCandidate = getNextCandidate;
exports.refuseCandidate = refuseCandidate;
exports.approveCandidate = approveCandidate;