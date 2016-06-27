(function() {
  'use strict';

  angular.module('app.toolbar', []).
  controller('ToolbarController', ToolbarController);

  ToolbarController.$inject = ['AuthService'];

  function ToolbarController(AuthService, $state) {
    var vm = this;
    vm.isOpen = false;

    vm.toggleToolbar = toggleToolbar;
    vm.logout = logout;

    function toggleToolbar() {
      vm.isOpen = !vm.isOpen;
    }

    function logout() {
      AuthService.setUserLoggedOut();
    }
  }


})();
