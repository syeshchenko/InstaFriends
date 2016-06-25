var User = require('../models/user');
var PoolDA = require('../data_access/pool');

function getNextCandidate(req, res, next) {

  var user = new User(req.user);

  PoolDA.getNextCandidate(user, function(err, poolUser) {

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

  PoolDA.refuseCandidate(params, function(err, success) {

    if (err) {
      console.log('error: ', err);
      res.status(400).send(err);
    } else {
      res.status(200).send({
        status: 'success'
      });
    }
  });
}

exports.getNextCandidate = getNextCandidate;
exports.refuseCandidate = refuseCandidate;
