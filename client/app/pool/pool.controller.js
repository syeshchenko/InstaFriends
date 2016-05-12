(function(){
  'use strict';

  angular.module('app.pool')
  .controller('PoolController', PoolController);

  PoolController.$inject = ['$rootScope','PoolService'];

  function PoolController($rootScope, PoolService) {
    var vm = this;
    vm.candidateName;
    vm.candidatePicUrl;
    var poolName;

    $rootScope.poolName = poolName = "Instagram";

    init();

    function init() {
      getCandidate();
    }

    function getCandidate(poolName) {
      PoolService.getCandidateTokenFromServer(poolName).then(getCandidateDataFromInstagram)
    }

    function getCandidateDataFromInstagram(token) {
      PoolService.getCandidateDataFromInstagram(token).then(displayUserData);
    }

    function displayUserData(data) {
      vm.candidateName = getUsername(data);
      vm.candidatePicUrl = getProfilePic(data);
    }

    function getUsername(data) {
      return data.data.data.username;
    }

    function getProfilePic(data) {
      return changeUrlToBiggerPic(data.data.data.profile_picture);
    }

    function changeUrlToBiggerPic(url) {
      return url.replace('s150x150', 's600x600');
    }

  }
})();
