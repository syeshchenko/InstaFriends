(function(){
  'use strict';

  angular.module('app.login')
  .factory('AuthService', AuthService);

  AuthService.$inject = ['$http'];


  function AuthService($http) {

    return {
      IsUserLoggedIn: IsUserLoggedIn
    }

    function setUserLoggedOut() {
      return $http.get('/api/logout')
    }

    function IsUserLoggedIn() {
      return $http.get('/api/isloggedin')
      .then(extractAnswer)
    }

    function extractAnswer(res) {
      return res.data.isLoggedIn;
    }

  }
})();
