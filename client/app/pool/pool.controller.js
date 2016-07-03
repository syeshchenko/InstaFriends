(function(){
  'use strict';

  angular.module('app.pool',[])
  .controller('PoolController', PoolController);

  PoolController.$inject = ['$rootScope','PoolService', '$state'];

  function PoolController($rootScope, PoolService, $state) {
    var vm = this;

    var userId = 0;
    var socialMediaType = 1;
    var userMedia = [];
    vm.candidateName='';
    vm.candidatePicUrl='';
    vm.approveCandidate = approveCandidate;
    vm.refuseCandidate = refuseCandidate;
    vm.displayPicInMainFrame = displayPicInMainFrame;
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

    function displayUserData(data) {
      if (getUserId(data) === -1) {
        $state.go('noUsers');
        return;
      }
      vm.candidateName = getCandidateName(data);
      vm.candidatePicUrl = getCandidateProfilePic(data);
      userId = getUserId(data);
      socialMediaType = getSocialMediaType(data);
      getCandidatePics(userId, socialMediaType);
    }

    function getUserId(data) {
      return data.id;
    }

    function getSocialMediaType(data) {
      return data.socialMediaType;
    }

    function getCandidatePics(userId, socialMediaType) {
      return PoolService.getUserMedia(userId, socialMediaType).
      then(displayCandidatePics);
    }

    function displayCandidatePics(data) {
      if (data.data.length === 0) {
        console.log('No user media of candidate ' + vm.candidateName);
        return;
      }
      userMedia = extractUserMedia(data);
      vm.pics = getThumbsURLsfromData(userMedia);
    }

    function extractUserMedia(data) {
      return data.data;
    }

    function displayPicInMainFrame(index){
     vm.candidatePicUrl = getPicUrlFromPics(index);
   }

   function getPicUrlFromPics(i) {
     return userMedia[i].images.standard_resolution.url;
   }

    function getThumbsURLsfromData(media) {
      var picUrls = [];
      for (var i = 0; i < frames; i++) {
        picUrls.push(media[i].images.thumbnail.url);
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
