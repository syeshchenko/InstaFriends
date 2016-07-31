(function(){
  'use strict';

  angular.module('app.notifications', []).
  controller('NotificationsController', NotificationsController);

  NotificationsController.$inject = ['$rootScope'];

  function NotificationsController($rootScope) {
    var nf = this;
    nf.clearMessages = clearMessages;
    $rootScope.messages = [];
    $rootScope.messages.add = add; // adds timestamp to the message and display
    function clearMessages() {
      $rootScope.messages.length = 0;
    }

    function add(msg) {
      var finalMsg = getTimeStamp() + ' ' + msg;
      $rootScope.messages.push(finalMsg);
    }

    function getTimeStamp() {
      var timeNow = new Date();
      var hours   = timeNow.getHours();
      var minutes = timeNow.getMinutes();
      var seconds = timeNow.getSeconds();
      var stamp = hours + ':' + minutes + ':' + seconds;
      return stamp;
    }
  }

})();
