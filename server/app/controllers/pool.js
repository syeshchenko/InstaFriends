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

  // approve user you just got from getNextCandidate
  PoolDA.approveCandidate(params, function (err, success) {
    if (err) {
      console.log('error: ', err);
      res.status(400).send(err);
    } else {

      var userMatchParams = {
        usersId: approvedUserId,
        shownUsersId: user.id
      };

      // check is user you just approved - already approved you before
      PoolDA.getIsFollowed(userMatchParams, function (err, success) {
        if (err) {
          // nope, first relationship was created, and that's it for now
          if (err.message && err.message.indexOf('Relationship does not exist') > -1) {
            res.status(201).send('created first relationship');
          } else {
            // something went wrong, we couldn't even create first relationship
            console.log('Unable to create first relationship: ', err);
            res.status(400).send(err);
          }

        } else {

          var params = {
            id: approvedUserId,
            socialMediaType: mediaTypeMapper.instagram
          };

          // users have follow relationship with each other, going to actually create it on Instagram

          // get access token of the second user
          UserDA.findUserById(params, function (err, secondUser) {
            if (err) {
              console.log('err: ', err);
              res.status(400).send('Unable to get second user by id: ' + err);
            } else {

              var secondUserObject = new User(secondUser);

              var firstFollowParams = {
                followerAccessToken: user.accessToken,
                userIdToFollow: secondUserObject.socialId
              };

              // current user to IG follow user they just 'followed' in our app
              createFollowRelationship(firstFollowParams, function (err, callback) {
                if (err) {
                  console.log('err: ', err);
                  res.status(400).send('Unable to create first relationship between users: ' + err);
                } else {

                  var secondFollowParams = {
                    followerAccessToken: secondUserObject.accessToken,
                    userIdToFollow: user.socialId
                  };

                  // create second relationship, the second user to IG follow current user
                  createFollowRelationship(secondFollowParams, function (err, result) {
                    if (err) {
                      console.log('err: ', err);
                      res.status(400).send('Unable to create second relationship between users: ' + err);
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
      });
    }
  });
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