(function() {
  'use strict';

  angular.module('app.toolbar', []).
  controller('ToolbarController', ToolbarController);

  ToolbarController.$inject = ['AuthService', 'ProfileService'];

  function ToolbarController(AuthService, ProfileService) {
    var vm = this;
    vm.isOpen = false;
    vm.userPicUrl = '';

    vm.toggleToolbar = toggleToolbar;
    vm.logout = logout;

    init();

    function init() {
      getUserPic();
    }

    function getUserPic() {
    ProfileService.getProfile().
    then(extractUserPic).
    then(displayUserPic);
    }

    function extractUserPic(data) {
      return data.data.user.profile_picture;
    }

    function extractUsername(data) {
      return data.data.user.user_name;
    }

    function displayUserPic(url) {
      vm.userPicUrl = url;
    }

    function toggleToolbar() {
      vm.isOpen = !vm.isOpen;
    }

    function logout() {
      AuthService.setUserLoggedOut();
    }
  }


})();
