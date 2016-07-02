(function(){
  'use strict';

  angular.module('app.pool',[])
  .controller('PoolController', PoolController);

  PoolController.$inject = ['$rootScope','PoolService', '$state'];

  function PoolController($rootScope, PoolService, $state) {
    var vm = this;

    var userId = 0;
    vm.candidateName='';
    vm.candidatePicUrl='';
    vm.approveCandidate = approveCandidate;
    vm.refuseCandidate = refuseCandidate;
    vm.pics = [];
    var frames = 4;

    init();

    function init() {
      getNextCandidate();
    }

    function getNextCandidate() {
      clearProfile();
      PoolService.getNextCandidate()
      .then(displayUserData);
    }

    function approveCandidate() {
      PoolService.approveCandidate(userId);
      getNextCandidate();
    }

    function refuseCandidate() {
      PoolService.refuseCandidate(userId);
      getNextCandidate();
    }

    function clearProfile() {
      vm.pics.length = 0;
      vm.candidateName = "";
      vm.candidatePicUrl = "";
    }

    function getCandidateProfile() {
      PoolService.getCandidateProfile()
      .then(displayUserData);
    }

    function displayUserData(data) {
      if (!data) {
        console.log('Next candidate request failed');
        $state.go('noUsers');
        return;
      }
      vm.candidateName = getCandidateName(data);
      vm.candidatePicUrl = getCandidateProfilePic(data);
      vm.pics = getCandidatePics(data);
      userId = getUserId(data);

    }

    function getUserId(data) {
      return data.id;
    }

    function getCandidatePics(data) {
      return getThumbsURLsfromData(data);
    }

    function getThumbsURLsfromData(data) {
      if (data.userMedia.length === 0) {
        console.log('No user media of candidate ' + vm.candidateName);
        return [];
      }
      var picUrls = [];
      for (var i = 0; i < frames; i++) {
        picUrls.push(data.userMedia[i].images.thumbnail.url);
      }
      return picUrls;
    }

    function getCandidateName(data) {
      return data.userName;
    }

    function getCandidateProfilePic(data) {
      return changeUrlToBiggerPic(data.profilePicture);
    }

    function changeUrlToBiggerPic(url) {
      return url.replace('s150x150', 's600x600');
    }

  }
})();
