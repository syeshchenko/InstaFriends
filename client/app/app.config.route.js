(function(){
  'use strict';

  angular
  .module('app')
  .config(['$stateProvider', '$urlRouterProvider', Router])
  .run(RouteChecker);

  RouteChecker.$inject = ['$rootScope', '$location', '$state'];

  function Router($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/"); // any unmatched url redirected to /

    $stateProvider
    .state('login', { // this state user enters when he is not logged in
      url: '/login',
      templateUrl: '/app/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    })
    .state('logout', {
      url: '/logout',
      templateUrl: '/app/logout/logout.html',
      controller: 'LogoutController',
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
    })
    .state('gate', { // this state is the entry point of the app
      url: '/',
      resolve: {
        isLoggedIn: function($http, $state) {
          return $http.get('/api/isloggedin')
          .then(function(res){
            if (res.data.isLoggedIn) $state.go('pool');
            else $state.go('login');
          })
          .error(function(error) {
            console.log("SERVER ERROR ", error);
          });
        }
      }
    });
  }

  function RouteChecker($rootScope, $location, $state, AuthService) {

    if ($location.url() === '') $location.url(''); // checks if user enters / to redirect to /#/

    }

  })();
