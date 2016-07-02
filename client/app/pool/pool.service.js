(function(){
  'use strict';

  angular.module('app.pool').
  factory('PoolService', PoolService);

  PoolService.$inject = ['$http'];

  function PoolService($http) {

    return {
      getNextCandidate: getNextCandidate,
      approveCandidate: approveCandidate,
      refuseCandidate: refuseCandidate
    };

    function approveCandidate(userId) {
      return $http.post('/api/approveCandidate', { approvedUserId: userId }, {});
      // add error handling
    }

    function refuseCandidate(userId) {
      return $http.post('/api/refuseCandidate', { refusedUserId: userId }, {});
      // add error handling
    }

    function getNextCandidate() {
      return $http.get('/api/nextCandidate').
      then(extractData);
    }
    function handleError(err) {
      console.log('No next candidate ',  err);
    }

    function extractData(data) {
      if (!data) return;
      return data.data;
    }
  }
})();
