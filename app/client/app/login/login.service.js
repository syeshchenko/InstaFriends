(function(){
  'use strict';

  angular.module('app.login')
  .factory('AuthService', AuthService);

  AuthService.$inject = ['$http', '$rootScope', '$state', '$q'];


  function AuthService($http, $rootScope, $state, $q) {

    $rootScope.isLoggedIn = false;

    return {
      isLoggedIn: isLoggedIn,
      setUserLoggedOut: setUserLoggedOut
    };

    function isLoggedIn() {
      var deferred = $q.defer();
      if ($rootScope.isLoggedIn) deferred.resolve(true);
      else IsUserLoggedInOnServer().
      then(function(loggedIn) {
        setUserLoggedInOnClient(loggedIn);
        deferred.resolve(loggedIn);
      });

      return deferred.promise;
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
    }

  }
})();
