(function(){
  'use strict';

  angular.module('app.pool',[])
  .controller('PoolController', PoolController);

  PoolController.$inject = ['$rootScope','PoolService', '$state'];

  function PoolController($rootScope, PoolService, $state) {
    var vm = this;

    var candidateId = 0; // holds userId from the database
    var candidateSocialMediaType = 0; // holds candidatecandidateSocialMediaType of current candidate
    var candidateMedia = [];
    vm.candidateName='';
    vm.candidatePicUrl='';
    vm.approveCandidate = approveCandidate;
    vm.refuseCandidate = refuseCandidate;
    vm.displayPicInMainFrame = displayPicInMainFrame;
    vm.noUsersMessage = '';
    vm.isCandidateAvailable = false;
    vm.pics = [];
    var frames = 4; // 4 pics to display

    init();

    function init() {
      getNextCandidate();
    }

    function getNextCandidate() {
      clearProfile();
      PoolService.getNextCandidate().
      success(displayUserData);
    }

    function approveCandidate() {
      PoolService.approveCandidate(candidateId);
      getNextCandidate();
    }

    function refuseCandidate() {
      PoolService.refuseCandidate(candidateId);
      getNextCandidate();
    }

    function clearProfile() {
      vm.pics.length = 0;
      vm.candidateName = "";
      vm.candidatePicUrl = "";
      candidateId = 0;
      candidateSocialMediaType = 0;
    }

    function displayUserData(data) {
      if (getCandidateId(data) === -1) {
        showNoMoreUsersState();
        return;
      }
      vm.isCandidateAvailable = true;
      vm.candidateName = getCandidateName(data);
      vm.candidatePicUrl = getCandidateProfilePic(data);
      candidateId = getCandidateId(data);
      candidateSocialMediaType = getCandidateSocialMediaType(data);
      getCandidatePics(candidateId, candidateSocialMediaType);
    }

    function showNoMoreUsersState() {
      vm.isCandidateAvailable = false;
      vm.noUsersMessage = 'NO MORE CANDIDATES';

    }

    function getCandidateId(data) {
      return data.id;
    }

    function getCandidateSocialMediaType(data) {
      return data.socialMediaType;
    }

    function getCandidatePics(candidateId, candidateSocialMediaType) {
      return PoolService.getCandidateMedia(candidateId, candidateSocialMediaType).
      then(displayCandidatePics);
    }

    function displayCandidatePics(data) {
      if (data.data.length === 0) {
        console.log('No user media of candidate ' + vm.candidateName);
        return;
      }
      candidateMedia = extractCandidateMedia(data);
      vm.pics = getThumbsURLsfromData(candidateMedia);
    }

    function extractCandidateMedia(data) {
      return data.data;
    }

    function displayPicInMainFrame(index){
      vm.candidatePicUrl = getPicUrlFromPics(index);
    }

    function getPicUrlFromPics(i) {
      return candidateMedia[i].images.standard_resolution.url;
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
