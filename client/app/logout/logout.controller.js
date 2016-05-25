(function(){
  'use strict';

  angular.module('app.logout')
  .controller('LogoutController', LogoutController);

  LogoutController.$inject = ['$http'];

  function LogoutController($http) {
    var vm = this;

    $.get('/api/logout', response);

    function response(data) {
      console.log('here');
      if (data.state == 200) {
        vm.message = 'BYE!';
      } else {
        vm.message = "ERROR";
      }
    }
  }
})();
