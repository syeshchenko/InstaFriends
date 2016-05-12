(function(){
  'use strict';

  angular.module('app.pool')
  .factory('PoolService', PoolService);

  PoolService.$inject = ['$http', '$rootScope'];

  function PoolService($http, $rootScope) {

    return {
      getCandidateTokenFromServer: getCandidateTokenFromServer,
      getCandidateDataFromInstagram: getCandidateDataFromInstagram
    }

    function getCandidateTokenFromServer() {
      return $http.get('/api/users', { 'poolName': $rootScope.poolName }).then(extractToken);
    }

    function extractToken(data) {
      return data.data[0].instagram.token;
    }

    function getCandidateDataFromInstagram(token) {
      return $http.get('https://crossorigin.me/https://api.instagram.com/v1/users/self/?access_token=' + token);
    }

  }
})();
