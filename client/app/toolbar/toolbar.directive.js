(function(){
  'use strict';

  angular.module('app.toolbar').
  directive('toolbar', Toolbar);

  function Toolbar() {
    return {
      restricted: 'E',
      templateUrl: '/app/toolbar/toolbar.html',
      controller: 'ToolbarController',
      controllerAs: 'vm'
    };
  }


})();
