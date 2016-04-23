(function() {
  'use strict';

  angular.module('app.main')
  .factory('InfoService', InfoService);

  InfoService.$inject = ['$http', '$rootScope'];

  function InfoService($http, $rootScope) {

    return {
      getPersonalData: getPersonalData
    }

    function getPersonalData() {
      return $http.get('/getData', {
        params:
        {
          token: $rootScope.token
        }
      });
    }
  }
})();
