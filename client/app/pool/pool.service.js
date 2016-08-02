(function(){
  'use strict';

  angular.module('app.pool').
  factory('PoolService', PoolService);

  PoolService.$inject = ['$http', '$rootScope'];

  function PoolService($http, $rootScope) {

    return {
      getNextCandidate: getNextCandidate,
      approveCandidate: approveCandidate,
      refuseCandidate: refuseCandidate,
      getCandidateMedia: getCandidateMedia
    };

    function approveCandidate(userId) {
      return $http.post('/api/approveCandidate', { 'approvedUserId': userId }, {});
    }

    function refuseCandidate(userId) {
      return $http.post('/api/refuseCandidate', { 'refusedUserId': userId }, {});
    }

    function getCandidateMedia(userId, socialMediaType) {
      return $http.post('/api/userMedia', { 'userId': userId, 'socialMediaType': socialMediaType }, {});
    }

    function getNextCandidate() {
      return $http.get('/api/nextCandidate');
    }
  }
})();
