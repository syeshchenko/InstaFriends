var User = require('../models/user');
var PoolDA = require('../data_access/pool');

function getNextCandidate(req, res, next) {

  var user = new User(req.user);

  PoolDA.getNextCandidate(user, function(err, poolUser) {
      res.status(201).json(poolUser);
  });

}

exports.getNextCandidate = getNextCandidate;
