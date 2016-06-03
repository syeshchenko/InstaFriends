var mysql = require('mysql');
var config = require('../../config');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
});

function findUserById(params, callback) {

  // get available db connection from the pool
  pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }

    var query = 'SELECT * from users where id = ' + params.id + ' AND social_media_type_id = ' + connection.escape(params.socialMediaType);

    // perform a query
    connection.query(query, function(err, rows) {

      // release the connection so it goes back to pool
      connection.release();

      if (err) {
        throw err;
      } else {

        // if
        if (rows.length) {
          callback(null, rows[0]);
        } else {
          callback(null);
        }
      }

    });

  });
};

module.exports.findUserBySocialId = function findUserBySocialId(params, callback) {

  pool.getConnection(function(err, connection) {

    if (err) {
      throw err;
    }

    var query = 'SELECT * from users where social_id = ' + params.socialId + ' AND social_media_type_id = ' + connection.escape(params.socialMediaType);

    connection.query(query, function(err, rows) {

      // release the connection
      connection.release();

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

  });

};

module.exports.createAccount = function createAccount(callback) {

  pool.getConnection(function(err, connection) {

    if (err) {
      throw err;
    }

    var createAccountQuery = 'INSERT INTO accounts (created_date) values (NOW())';

    connection.query(createAccountQuery, function(err, result) {

      connection.release();

      if (err) {
        throw err;
      }

      callback(result);
    });
  });
};

module.exports.createUser = function getOrCreateInstagramUser(user, callback) {

  pool.getConnection(function(err, connection) {

    if (err) {
      throw err;
    }

    var createUserQuery = 'INSERT INTO users (social_id, user_name, profile_picture, social_media_type_id, access_token, is_active, created_date, account_id) values (' +
      user.socialId + ', ' + connection.escape(user.userName) + ', ' + connection.escape(user.profilePicture) + ', ' + user.socialMediaType + ', ' + connection.escape(user.accessToken) + ', ' +
      connection.escape(user.isActive) + ', ' + 'NOW()' + ', ' + connection.escape(user.accountId) + ')';

    connection.query(createUserQuery, function(err, result) {

      connection.release();

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
  });
};

module.exports.getAllUsers = function getAllUsers(callback) {

  pool.getConnection(function(err, connection) {

    if (err) {
      throw err;
    }

    var query = 'SELECT * from users';

    connection.query(query, function(err, result) {

      connection.release();

      if (err) {
        throw err;
      }

      callback(null, result);
    });
  });
}

module.exports.findUserById = findUserById;
