(function(){
  'use strict';

  angular.module('app.logout',[])
  .controller('LogoutController', LogoutController);

  LogoutController.$inject = ['$location', 'AuthService'];

  function LogoutController($location, AuthService) {
    var vm = this;

    AuthService.setUserLoggedOut();
    $location.url('/login');
  }
})();
