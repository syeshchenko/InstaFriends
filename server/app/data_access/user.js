var mysql = require('mysql');
var config = require('../../config');

var connection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
});

connection.connect(function(err) {
  if (err) {
    throw err;
  } else {
    console.log('connected to mysql');
  }
});

function findUserById(params, callback) {

  var query = 'SELECT * from users where id = ' + params.id +  ' AND social_media_type_id = ' + connection.escape(params.socialMediaType);

  connection.query(query, function(err, rows) {
    if (err) {
      throw err;
    } else {
      if (rows.length) {
        callback(null, rows[0]);
      } else {
        callback(null);
      }
    }
  });
};

module.exports.findUserBySocialId = function findUserBySocialId(params, callback) {

  var query = 'SELECT * from users where social_id = ' + params.socialId +  ' AND social_media_type_id = ' + connection.escape(params.socialMediaType);

  connection.query(query, function(err, rows) {
    if (err) {
      throw err;
    } else {
      if (rows.length) {
        callback(null, rows[0]);
      } else {
        callback(null);
      }
    }
  });
};

module.exports.createAccount = function createAccount(callback) {

  var createAccountrQuery = 'INSERT INTO accounts (created_date) values (NOW())';

  connection.query(createAccountrQuery, function(err, result) {
    callback(result);
  });
};

module.exports.createUser = function getOrCreateInstagramUser(user, callback) {

  var createUserQuery = 'INSERT INTO users (social_id, user_name, profile_picture, social_media_type_id, access_token, is_active, created_date, account_id) values (' +
  user.socialId + ', ' +connection.escape(user.userName) + ', ' + connection.escape(user.profilePicture) + ', ' + user.socialMediaType + ', ' + connection.escape(user.accessToken) + ', ' +
  connection.escape(user.isActive) + ', ' + 'NOW()' + ', ' + connection.escape(user.accountId) + ')';

  connection.query(createUserQuery, function(err, result) {

    if (err) {
      throw err;
    }

    var params = {
      id: result.insertId,
      socialMediaType: user.socialMediaType
    }

    findUserById(params, function(err, user) {
      if (err) {
        throw err;
      }

      if (user) {
        callback(null, user);
      }
    });
  });
};

module.exports.getAllUsers = function getAllUsers(callback) {
  var query = 'SELECT * from users';

  connection.query(query, function(err, result) {
    if (err) {
      throw err;
    }

    callback(null, result);

  });
}

module.exports.findUserById = findUserById;
