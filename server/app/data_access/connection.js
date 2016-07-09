var mysql = require('mysql');
var config = require('../../config');

var Connection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
});

exports.Connection = Connection;
