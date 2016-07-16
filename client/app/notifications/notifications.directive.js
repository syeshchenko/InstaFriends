(function(){
  'use strict';

  angular.module('app.notifications').
  directive('notifications', Notifications);

  function Notifications() {
    return {
      restricted: 'E',
      templateUrl: '/app/notifications/notifications.html',
      controller: 'NotificationsController',
      controllerAs: 'nf'
    };
  }


})();
