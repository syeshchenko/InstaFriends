(function() {
  'use strict';

  angular.module('app.core',['ui.router'])
  .factory('StatusCodeInterceptor', StatusCodeInterceptor);

  StatusCodeInterceptor.$inject = ['$q', '$location', '$rootScope'];

  function StatusCodeInterceptor($q, $location, $rootScope) {
    return {
      response: response,
      responseError: responseError
    };

    function response(res) {
      return res;
    }

    function responseError(res) {
      if (res.status === 401) {
        $location.url('/login');
        $rootScope.messages.add('Please authorize!');
        return $q.reject(response);
      }

      if (res.status === 400) {
        $rootScope.messages.add('Server issues. Please try again later.');
        console.error( '400 Bad request: ' , res.data.message);
      }

      if (res.status < 0) {
        $rootScope.messages.add('Server issues. Please try again later.');
      }

    }
  }

  angular.module('app.core')
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('StatusCodeInterceptor');
  }]);
})();
