var express = require('express');
var usersController = require('./app/controllers/users');
var authController = require('./app/controllers/auth');

function setup(router, app, passport) {

  // auth requests
  app.get('/auth/instagram', passport.authenticate('instagram', {
  }));

  app.get('/auth/instagram/callback',
    passport.authenticate('instagram', {
      successRedirect: '/',
      failureRedirect: '/login',
      scope: 'relationships'
    }));

  // route for logging out
  router.get('/logout', authController.logout);

  // add isLoggedIn middleware
  router.get('/profile', authController.isLoggedIn, usersController.getUserProfile);

  // API requests
  router.get('/users', authController.isLoggedIn, usersController.getUsers);

  router.get('/isloggedin', authController.getIsLoggedIn);
}

module.exports.setup = setup;
