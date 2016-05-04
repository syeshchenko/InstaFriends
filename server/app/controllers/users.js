var config = require('../../config');
var User = require('../models/user');

function getUsers(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
}

exports.getUsers = getUsers;
