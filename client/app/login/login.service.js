(function(){
  'use strict';

  angular.module('app.login')
  .factory('AuthService', AuthService);

  AuthService.$inject = ['$http', '$rootScope', '$state'];


  function AuthService($http, $rootScope, $state) {

    $rootScope.isLoggedIn = false;

    return {
      isLoggedIn: isLoggedIn,
      setUserLoggedOut: setUserLoggedOut
    };

    function isLoggedIn() {
      if ($rootScope.isLoggedIn) return true;
      else return IsUserLoggedInOnServer().
      then(setUserLoggedInOnClient);
    }

    function setUserLoggedOut() {
      $rootScope.isLoggedIn = false;
      $http.get('/api/logout').
      success(redirectToLogin).
      error(logoutError);
    }

    function redirectToLogin() {
      $state.go('login');
    }

    function logoutError(err) {
      console.log('Couldn\'t logout', err);
    }

    function IsUserLoggedInOnServer() {
      return $http.get('/api/isloggedin').
      then(extractAnswer);
    }

    function extractAnswer(res) {
      return res.data.isLoggedIn;
    }

    function setUserLoggedInOnClient(loggedIn) {
      if (loggedIn === true) $rootScope.isLoggedIn = true;
      return loggedIn;
    }

  }
})();
