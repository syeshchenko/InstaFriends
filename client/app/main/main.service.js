(function() {
  'use strict';

  angular.module('app.main')
  .factory('InfoService', InfoService);

  InfoService.$inject = ['$http', '$rootScope'];

  function InfoService($http, $rootScope) {

    return {
      getProfileData: getProfileData
    }

    function getProfileData() {
      return $http.get('/users');
    }
  }
})();
