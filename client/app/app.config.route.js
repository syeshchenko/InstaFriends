(function(){
  'use strict';

  angular
  .module('app')
  .config(Router)
  .run(stateChecker)
  .run(routeChecker);

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
    .state('profile', { // this state user enters when he is logged in
      url: '/profile',
      templateUrl: '/app/profile/profile.html',
      controller: 'ProfileController',
      controllerAs: 'vm'
    })
    .state('pool', { // this state user enters when he is logged in
      url: '/pool',
      templateUrl: '/app/pool/pool.html',
      controller: 'PoolController',
      controllerAs: 'vm'
    });
  }

  function routeChecker($location) {

    // redirects from root to pool
    if ($location.url() === '/' || $location.url() === '') $location.url('/pool');

  }

  function stateChecker($rootScope, AuthService, $state) {

    $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams, options){

      if (!AuthService.isLoggedIn()) {
        event.preventDefault();
        $state.go('login');
      }
    });
  }

})();
