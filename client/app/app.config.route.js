(function(){
  'use strict';

  angular
  .module('app')
  .config(Router)
  .run(routeChecker)
  .run(stateChecker);

  routeChecker.$inject = ['$location'];
  stateChecker.$inject = ['$rootScope', 'AuthService', '$state'];
  Router.$inject = ['$stateProvider', '$urlRouterProvider'];

  function Router($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/"); // any unmatched url redirected to /

    $stateProvider
    .state('login', { // this state user enters when he is not logged in
      url: '/login',
      templateUrl: '/app/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    })
    .state('pool', { // this state user enters when he is logged in
      url: '/',
      templateUrl: '/app/pool/pool.html',
      controller: 'PoolController',
      controllerAs: 'vm'
    });
  }

  function routeChecker($location) {
    // redirects from / to /#/
    if ($location.url() === '/') $location.url('/');
  }

  function stateChecker($rootScope, AuthService, $state) {

    $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams, options){

      AuthService.isLoggedIn().
      then(function(loggedIn){
        if (loggedIn === false) {
          event.preventDefault();
          $state.go('login');
        }
      });

    });
  }
})();
