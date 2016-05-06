var express = require('express');
var usersController = require('./app/controllers/users');
var authController = require('./app/controllers/auth');

function setup(router, app, passport) {

  // auth requests
  app.get('/auth/instagram', passport.authenticate('instagram', {
  }));

  app.get('/auth/instagram/callback',
    passport.authenticate('instagram', {
      successRedirect: '/#/profile',
      failureRedirect: '/'
    }));

  // route for logging out
  router.get('/logout', authController.logout);

  // add isLoggedIn middleware
  router.get('/profile', authController.isLoggedIn, usersController.getUserProfile);

  // API requests
  router.get('/users', authController.isLoggedIn, usersController.getUsers);
}

module.exports.setup = setup;
