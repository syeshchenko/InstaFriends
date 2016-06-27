(function(){
  'use strict';

  angular.module('app.pool',[])
  .controller('PoolController', PoolController);

  PoolController.$inject = ['$rootScope','PoolService'];

  function PoolController($rootScope, PoolService) {
    var vm = this;
    vm.candidateName='';
    vm.candidatePicUrl='';
    vm.getNextCandidate = getNextCandidate;
    vm.getPreviousCandidate = getPreviousCandidate;
    vm.pics = [];
    vm.displayPic = displayPic;
    var userMedia;
    var frames = 4;

    init();

    function init() {
      getNextCandidate();
    }

    function getNextCandidate() {
      clearProfile();
      getCandidateProfile();
      getRecentMedia();
    }

    function getPreviousCandidate() {
      clearProfile();
      getCandidateProfile();
      getRecentMedia();
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

    function getRecentMedia() {
      PoolService.getRecentMedia()
      .then(extractMedia)
      .then(displayPics);
    }

    function extractMedia(data) {
      userMedia = data.data;
      return this;
    }

    function displayUserData(data) {
      vm.candidateName = getUsername(data);
      $rootScope.candidatePicUrl = getProfilePic(data);
    }

    function displayPics(data) {
      getThumbsURLsfromData(userMedia);
    }

    function displayPic(index){
      vm.candidatePicUrl = getPicUrl(userMedia, index);
    }

    function getPicUrl(userMedia, i) {
      return userMedia.data[i].images.standard_resolution.url;
    }

    function getThumbsURLsfromData(userMedia) {
      for (var i = 0; i < frames; i++) {
        vm.pics.push(userMedia.data[i].images.thumbnail.url)
      }
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
