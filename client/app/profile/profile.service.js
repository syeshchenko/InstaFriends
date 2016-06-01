(function() {
  'use strict';

  angular.module('app.profile')
  .factory('InfoService', InfoService);

  InfoService.$inject = ['$http', '$rootScope'];

  function InfoService($http, $rootScope) {

    return {
      getProfileData: getProfileData
    }

    function getProfileData() {
      return $http.get('/api/users')
      .then(extractUsername);
    }

    function extractUsername(data) {
      return data.data[0].instagram.name;
    }
  }
})();
