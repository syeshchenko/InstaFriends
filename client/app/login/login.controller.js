(function(){
  'use strict';

  angular.module('app.login', [])
  .controller('LoginController', LoginController);


  function LoginController() {
    var vm = this;

    vm.login = function() {
      window.location.replace("/auth/instagram");
    }
  }

})();
