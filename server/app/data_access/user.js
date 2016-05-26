var mysql = require('mysql');
var config = require('../config');

var connection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
});

connection.connect(function(err) {
  if (err) {
    console.log('error connecting: ', err);
  } else {
    console.log('success');
  }
});

module.exports.findOne = function findOne(id, callback) {

  connection.query('SELECT * from users where id = 1 and social_media_type = \'instagram\'', function(err, rows) {
    console.log('rows: ', rows);
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
};

module.exports.createUser = function getOrCreateInstagramUser(user, callback) {
  connection.query('INSERT INTO users SET ?', user, function(err, result) {
    callback(result);
  });

};
