var pool = require('./connection_pool').Pool;

function getNextCandidate(user, callback) {

  // get available db connection from the pool
  pool.getConnection(function (err, connection) {
    if (err) {
      callback(err);
    } else {
      var getNextCandidateQuery = 'SELECT ' +
        '* ' +
        'FROM ' +
        'users AS user ' +
        'WHERE ' +
        ' NOT EXISTS ' +
        '( SELECT *  ' +
        'FROM user_follows AS follower ' +
        'WHERE follower.users_id = user.id ' +
        'AND follower.shown_users_id = ' + user.id + ' ' +
        'AND follower.followed = 0 ' +
        ') ' +
        'AND ' +
        'NOT EXISTS ' +
        '( SELECT * ' +
        'FROM user_follows AS followed ' +
        'WHERE followed.shown_users_id = user.id ' +
        'AND followed.users_id = ' + user.id + ' ' +
        ') ' +
        'AND ' +
        'user.id <> ' + user.id + ' ' +
        'LIMIT 1';

      connection.query(getNextCandidateQuery, function (err, result) {
        connection.release();

        if (err) {
          callback(err);
        } else {
          if (result.length) {
            callback(null, result[0]);
          } else {
            callback({ message: 'Unable to get next candidate from DB' });
          }
        }
      });
    }
  });
}

function refuseCandidate(params, callback) {

  // get available db connection from the pool
  pool.getConnection(function (err, connection) {
    if (err) {
      callback(err);
    } else {
      var query = 'INSERT into user_follows (users_id, shown_users_id, followed, created_date) values( ' + params.currentUser.id + ', ' + params.refusedUserId + ', ' + 0 + ', ' + 'NOW())'

      connection.query(query, function (err, result) {
        connection.release();

        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  });
};

function approveCandidate(params, callback) {

  // get available db connection from the pool
  pool.getConnection(function (err, connection) {
    if (err) {
      callback(err);
    } else {
      var query = 'INSERT into user_follows (users_id, shown_users_id, followed, created_date) values( ' + params.currentUser.id + ', ' + params.approvedUserId + ', ' + 1 + ', ' + 'NOW())'

      connection.query(query, function (err, result) {
        connection.release();

        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  });
};

function getIsFollowed(params, callback) {

  pool.getConnection(function (err, connection) {
    if (err) {
      callback(err);
    } else {
      var checkFollowedQuery = 'SELECT followed FROM user_follows where users_id = ' + params.usersId + ' AND shown_users_id = ' + params.shownUsersId;
      connection.query(checkFollowedQuery, function (err, result) {
        connection.release();

        if (err) {
          callback(err)
        } else {
          if (result.length) {
            callback(null, result[0]);
          } else {
            callback({ message: 'Relationship does not exist' });
          }
        }
      });
    }
  });
}

module.exports.getNextCandidate = getNextCandidate;
module.exports.refuseCandidate = refuseCandidate;
module.exports.approveCandidate = approveCandidate;
module.exports.getIsFollowed = getIsFollowed;
