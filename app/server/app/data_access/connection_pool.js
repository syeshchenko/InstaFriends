var mysql = require('mysql');
var config = require('../../config_' + process.env.APP_STATE);

var Pool = mysql.createPool({
  connectionLimit: 10,
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
});

exports.Pool = Pool;
