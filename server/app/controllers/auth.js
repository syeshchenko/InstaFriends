
// remove user from session
function logout(req, res) {
  req.logout();
  res.redirect('/');
}

// middleware to check if user is currently logged in
// proceed if true, redirect to / otherwise
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).send('missing authorization header');
}

function getIsLoggedIn(req, res, next) {
  res.json({isLoggedIn: req.isAuthenticated()});
}


exports.logout = logout;
exports.isLoggedIn = isLoggedIn;
exports.getIsLoggedIn = getIsLoggedIn;
