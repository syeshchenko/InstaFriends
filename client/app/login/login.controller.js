(function(){
  'use strict';

  angular.module('app.login')
  .controller('LoginController', LoginController);

  LoginController.$inject = ['$state'];

  function LoginController($state) {
    var vm = this;

    vm.login = function() {

      // var client_id = "e4ad4e115bf34ef495c72e36600302ef";
      // var scope = "email";
      // var redirect_uri = "https://localhost:5000";
      // var response_type = "token";
      // var url = "https://api.instagram.com/oauth/authorize/?client_id=" +
      // client_id + "&redirect_uri=" + redirect_uri + "&response_type=" + response_type;

      window.location.replace("/auth/instagram");
    }
  }

})();
