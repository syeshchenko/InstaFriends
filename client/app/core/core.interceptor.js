(function() {
  'use strict';

  angular.module('app.core',['ui.router'])
  .factory('StatusCodeInterceptor', StatusCodeInterceptor);

  StatusCodeInterceptor.$inject = ['$q', '$location'];

  function StatusCodeInterceptor($q, $location) {
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
        return $q.reject(response);
      }

      if (res.status === 400) {
        console.log( '400 ' , res.data.message);
      }

    }
  }

  angular.module('app.core')
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('StatusCodeInterceptor');
  }]);
})();
