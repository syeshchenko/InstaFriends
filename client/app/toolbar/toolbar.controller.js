(function() {
  'use strict';

  angular.module('app.toolbar', []).
  controller('ToolbarController', ToolbarController);

  ToolbarController.$inject = ['AuthService', 'ProfileService'];

  function ToolbarController(AuthService, ProfileService) {
    var vm = this;
    vm.isOpen = false;
    vm.userPicUrl = '';
    vm.username = '';

    vm.toggleToolbar = toggleToolbar;
    vm.logout = logout;

    init();

    function init() {
      getUserProfile();
    }

    function getUserProfile() {
      ProfileService.getProfile().
      then(extractUserProfile).
      then(displayUserProfile);
    }

    function extractUserProfile(data) {
      return data.data.user;
    }

    function displayUserProfile(data) {
      vm.username = getUsername(data);
      vm.userPicUrl = getUserPic(data);
    }

    function getUsername(data) {
      return data.user_name;
    }

    function getUserPic(data) {
      return data.profile_picture;
    }

    function toggleToolbar() {
      vm.isOpen = !vm.isOpen;
    }

    function logout() {
      vm.isOpen = false; // to remove mask
      AuthService.setUserLoggedOut();
    }
  }


})();
