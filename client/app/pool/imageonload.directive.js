(function(){
  'use strict';

  angular.module('app.pool').
  directive('imageonload', function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('load', function() {
          $rootScope.candidateImageLoaded = true;
          $rootScope.$digest();
        });
        element.bind('error', function(){
          console.log('candidate image could not be loaded');
        });
      }
    };
  });
})();
