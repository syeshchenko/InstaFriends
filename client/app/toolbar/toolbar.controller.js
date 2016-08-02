(function() {
  'use strict';

  angular.module('app.toolbar', []).
  controller('ToolbarController', ToolbarController);

  ToolbarController.$inject = ['AuthService', 'ProfileService', '$rootScope'];

  function ToolbarController(AuthService, ProfileService, $rootScope) {
    var vm = this;
    vm.isOpen = false;
    vm.userPicUrl = '';
    vm.username = '';

    $rootScope.$watch('isLoggedIn', function(val) {
      if (val === true) vm.getUserProfile();
    }); // get user profile when the user is logged in

    vm.getUserProfile = function() {
      ProfileService.getProfile().
      success(vm.displayUserProfile).
      error(vm.logError);
    };

    vm.displayUserProfile = function(data) {
      vm.username = vm.getUsername(data);
      vm.userPicUrl = vm.getUserPic(data);
    };

    vm.getUsername = function(data) {
      return data.userName;
    };

    vm.getUserPic = function(data) {
      return data.profilePicture;
    };

    vm.toggleToolbar = function() {
      vm.isOpen = !vm.isOpen;
    };

    vm.logout = function() {
      AuthService.setUserLoggedOut();
    };

    vm.logError = function(err) {
      console.error(err);
    };
  }
})();
