(function(){
  'use strict';

  angular.module('app.pool')
  .factory('PoolService', PoolService);

  PoolService.$inject = ['$http', '$rootScope'];

  function PoolService($http, $rootScope) {

    return {
      getCandidateProfile: getCandidateProfile,
      getRecentMedia: getRecentMedia
    }


    function getCandidateProfile() {
      return getCandidateTokenFromServer()
      .then(getCandidateProfileClientSide)
    }

    function getRecentMedia() {
      return getCandidateTokenFromServer()
      .then(getRecentMediaClientSide)
    }

    function getCandidateTokenFromServer() { // temporary
      return $http.get('/api/users').then(extractToken);
    }

    function extractToken(data) { // temporary
      return data.data[0].instagram.token;
    }

    function getCandidateProfileClientSide(token) {
      return $http.jsonp('https://api.instagram.com/v1/users/self/?access_token='
       + token + '&callback=JSON_CALLBACK' );
    }

    function getRecentMediaClientSide(token) {
      return $http.jsonp('https://api.instagram.com/v1/users/self/media/recent/?access_token='
    + token + '&callback=JSON_CALLBACK');
    }

  }
})();
