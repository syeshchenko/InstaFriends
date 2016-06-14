var pool = require('./connection_pool').Pool;

function getNextCandidate(user, callback) {

  // get available db connection from the pool
  pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }

    var query = 'SELECT id, social_id, user_name, profile_picture, social_media_type_id FROM users as user inner join user_follows as follow where ' +
      'user.social_media_type_id = ' + user.socialMediaType + ' and user.id != ' + user.id + ' AND follow.shown_users_id != ' + user.id + ' limit 1';

    // perform a query
    connection.query(query, function(err, result) {

      // release the connection so it goes back to pool
      connection.release();

      if (err) {
        throw err;
      } else {

        // if
        if (result.length) {
          callback(null, result);
        } else {
          callback(null);
        }
      }
    });
  });
};

module.exports.getNextCandidate = getNextCandidate;
