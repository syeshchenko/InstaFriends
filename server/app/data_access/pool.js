var pool = require('./connection_pool').Pool;

function getNextCandidate(user, callback) {

  // get available db connection from the pool
  pool.getConnection(function (err, connection) {
    if (err) {
      callback(err);
    } else {
      var getNextCandidateQuery = 'SELECT ' +
         'user.id, user.user_name, user.profile_picture, user.is_active, user.social_media_type_id ' + 
      'FROM ' + 
         'users AS user ' +
      'WHERE ' +
         ' NOT EXISTS ' +
            '( SELECT *  ' +
              'FROM user_follows AS follower ' +
              'WHERE follower.users_id = user.id ' +
                'AND follower.shown_users_id = ' + user.id + ' ' + 
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

      connection.query(getNextCandidateQuery, function(err, result) {
        if (err) {
          callback(err);
        } else {
          if (result.length) {
            callback(null, result[0]);
          } else {
            callback({message: 'Unable to get next candidate from DB'}, null);
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
      return callback(err);
    }

    var query = 'INSERT into user_follows (users_id, shown_users_id, followed, created_date) values( ' + params.currentUser.id + ', ' + params.refusedUserId + ', ' + 0 + ', ' + 'NOW())'

    connection.query(query, function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    });

  });

};

module.exports.getNextCandidate = getNextCandidate;
module.exports.refuseCandidate = refuseCandidate;
