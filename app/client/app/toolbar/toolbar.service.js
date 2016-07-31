(function() {
  'strict';

  angular.module('app.toolbar').
  factory('ProfileService', ProfileService);

  ProfileService.$inject = ['$http'];

  function ProfileService($http) {

    return {
      getProfile: getProfile
    };

    function getProfile() {
      return $http.get('/api/profile');
    }

  }
})();
