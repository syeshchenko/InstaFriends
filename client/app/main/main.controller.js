(function(){
  'use strict';

  angular.module('app.main')
  .controller('MainController', MainController);

  MainController.$inject = ['$location', '$rootScope', 'InfoService'];

  function MainController($location, $rootScope, InfoService) {
    var vm = this;
    vm.response;

    init();

    function init() {
      $rootScope.token = getTokenFromUrl();
      requestProfileData();
    }

    function requestProfileData() {
      InfoService.getProfileData()
      .then(displayData);
    }

    function displayData(data) {
      console.log(data);
      //vm.response = 'Welcome, ' + data.data.data.username;
    }

    function getTokenFromUrl() {

      var location = $location.path();
      var array = location.split('=');

      return array[1];
    }

  }
})();
