(function(){
  'use strict';

  angular.module('app.main')
  .controller('MainController', MainController);

  MainController.$inject = ['$location', '$rootScope', 'InfoService'];

  function MainController($location, $rootScope, InfoService) {
   var vm = this;
   vm.response;
   vm.requestData = requestData;

   init();

   function init() {

     $rootScope.token = getTokenFromUrl();
   }

   function requestData() {
      InfoService.getPersonalData()
      .then(displayData);
   }

   function displayData(data) {
       vm.response = data.data.data.username;
   }

   function getTokenFromUrl() {

     var location = $location.path();
     var array = location.split('=');

     return array[1];
   }

  }
})();
