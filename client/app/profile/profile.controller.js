(function(){
  'use strict';

  angular.module('app.profile')
  .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$location', '$rootScope', 'InfoService'];

  function ProfileController($location, $rootScope, InfoService) {
    var vm = this;
    vm.response;

    init();

    function init() {
      requestProfileData();
    }

    function requestProfileData() {
      InfoService.getProfileData()
      .then(displayUsername);
    }

    function displayUsername(username) {
      console.log(username);
      vm.response = 'Welcome, ' + username;
    }

  }
})();
