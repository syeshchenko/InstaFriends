(function(){
  'use strict';

  angular
  .module('app')
  .config(['$stateProvider', Router])
  .run(RouteChecker);

  Router.$inject = ['$stateProvider'];

  RouteChecker.$inject = ['$rootScope', '$state', '$location', 'AuthService'];

  function Router($stateProvider) {
    $stateProvider
    .state('login', { // this state user enters when he is not logged in
      url: '/login',
      templateUrl: '/app/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    })
    .state('main', { // this state user enters when he is logged in
      url: '/access_token=:accessToken',
      templateUrl: '/app/main/main.html',
      controller: 'MainController',
      controllerAs: 'vm'
    })
    .state('gate', { // this state is the entry point of the app
      url: '/',
      templateUrl: '/app/main/main.html',
      controller: 'MainController',
      controllerAs: 'vm'
    });
  }

  function RouteChecker($rootScope, $state, $location, AuthService) {

    if ($location.path() == '') $location.path(''); // checks if user enters / to redirect to /#/

    $rootScope.$on( '$stateChangeStart', function(e, toState, toParams, // listener to state changes
      fromState, fromParams) {

      if (toState.name === "main") AuthService.setUserLoggedIn(); // temporary set user logged in

        var isStateLogin = toState.name === "login";  /* checking if the user is redirected
                       to login page after he was redirected to login page to avoid loop */
        if(isStateLogin){
          return; // no need to redirect
        }

        var isLoggedIn = AuthService.IsUserLoggedIn();

        if (!isLoggedIn) {
          e.preventDefault();
          $state.go('login');
        }
      });
    }

  })();
