(function(){
  'use strict';
  
  angular
  .module('app')
  .config(['$stateProvider', Router])

  Router.$inject = ['$stateProvider'];

  RouteChecker.$inject = ['$rootScope', '$state'];

  function Router($stateProvider) {
    $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: '/app/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    });
  }

})();
