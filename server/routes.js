var express = require('express');
var userController = require('./app/controllers/users');

function setup(router, app, passport) {

  // auth requests
  app.get('/auth/instagram', passport.authenticate('instagram', {
  }));

  app.get('/auth/instagram/callback',
    passport.authenticate('instagram', {
      successRedirect: '/#/profile',
      failureRedirect: '/'
    }));

  app.get('/')

  // route for logging out
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // API requests
  router.get('/users', userController.getUsers);

  router.get('/', function(req, res) {
    res.json({
      message: 'Welcome to the collest API on earth!'
    });
  });

}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}

module.exports.setup = setup;
