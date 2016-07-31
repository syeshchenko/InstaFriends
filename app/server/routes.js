var express = require('express');
var usersController = require('./app/controllers/users');
var authController = require('./app/controllers/auth');
var poolController = require('./app/controllers/pool');

function setup(router, app, passport) {

  // auth requests
  app.get('/auth/instagram', passport.authenticate('instagram', { scope: ['relationships', 'public_content'] }));

  app.get('/auth/instagram/callback',
    passport.authenticate('instagram', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  // route for logging out
  router.get('/logout', authController.logout);
  // add isLoggedIn middleware
  router.get('/profile', authController.isLoggedIn, usersController.getUserProfile);
  // API requests
  router.get('/users', authController.isLoggedIn, usersController.getUsers);
  router.get('/isloggedin', authController.getIsLoggedIn);
  router.get('/nextCandidate', authController.isLoggedIn, poolController.getNextCandidate);

  router.post('/refuseCandidate', authController.isLoggedIn, poolController.refuseCandidate);
  router.post('/approveCandidate', authController.isLoggedIn, poolController.approveCandidate)
  router.post('/userMedia', authController.isLoggedIn, usersController.getUserMedia);
}

module.exports.setup = setup;
