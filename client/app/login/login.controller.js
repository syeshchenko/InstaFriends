(function(){
  'use strict';

  angular.module('app.login')
  .controller('LoginController', LoginController);

  LoginController.$inject = ['$state'];

  function LoginController($state) {
    var vm = this;
  }

})();
