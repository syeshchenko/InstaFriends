(function(){
  'use strict';

  angular.module('app.login')
  .factory('AuthService', AuthService)


  function AuthService() {

    var userLoggedIn = false;

    return {
      IsUserLoggedIn: IsUserLoggedIn,
      setUserLoggedIn: setUserLoggedIn
    }

    function IsUserLoggedIn() {
      return userLoggedIn;
    }

    function setUserLoggedIn() {
      userLoggedIn = true;
    }

  }
})();
