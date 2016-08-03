(function(){
  'use strict';

  angular.module('app.pool',[])
  .controller('PoolController', PoolController);

  PoolController.$inject = ['$rootScope','PoolService'];

  function PoolController($rootScope, PoolService) {
    var vm = this;

    vm.candidateId = 0;
    vm.candidateSocialMediaType = 0;
    vm.candidateMedia = [];
    vm.candidateName='';
    vm.candidatePicUrl='';
    vm.noUsersMessage = '';
    vm.isCandidateAvailable = false;
    $rootScope.candidateImageLoaded = false;
    vm.pics = [];
    vm.frames = 4;

    vm.init = function() {
      vm.getNextCandidate();
    };

    vm.getNextCandidate = function() {
      vm.clearProfile();
      PoolService.getNextCandidate().
      success(vm.displayUserData).
      error(function(err) {
        vm.logError('Fetching next candidate failed', err);
      });
    };

    vm.approveCandidate = function() {
      $rootScope.candidateImageLoaded = false;
      PoolService.approveCandidate(vm.candidateId).
      success(function(msg){
        vm.logSuccess(msg);
        vm.getNextCandidate();
      }).
      error(function(err){
        vm.logError('Approving candidate ' + vm.candidateName + ' failed', err);
      });
    };

    vm.refuseCandidate = function() {
      $rootScope.candidateImageLoaded = false;
      PoolService.refuseCandidate(vm.candidateId).
      success(function(msg){
        vm.logSuccess(msg);
        vm.getNextCandidate();
      }).
      error(function(err){
        vm.logError('Refusing candidate ' + vm.candidateName + ' failed', err);
      });
    };

    vm.clearProfile = function() {
      vm.pics.length = 0;
      vm.candidateName = "";
      vm.candidatePicUrl = "";
      vm.candidateId = 0;
      vm.candidateSocialMediaType = 0;
    };

    vm.displayUserData = function(data) {
      if (vm.getCandidateId(data) === -1) {
        vm.showNoMoreUsersState();
        return;
      }
      vm.isCandidateAvailable = true;
      vm.candidateName = vm.getCandidateName(data);
      vm.candidatePicUrl = vm.getCandidateProfilePic(data);
      vm.candidateId = vm.getCandidateId(data);
      vm.candidateSocialMediaType = vm.getCandidateSocialMediaType(data);
      vm.getCandidatePics(vm.candidateId, vm.candidateSocialMediaType);
    };

    vm.showNoMoreUsersState = function() {
      vm.isCandidateAvailable = false;
      vm.noUsersMessage = 'NO MORE CANDIDATES';
    };

    vm.getCandidateId = function(data) {
      return data.id;
    };

    vm.getCandidateSocialMediaType = function(data) {
      return data.socialMediaType;
    };

    vm.getCandidatePics = function(candidateId, candidateSocialMediaType) {
      return PoolService.getCandidateMedia(candidateId, candidateSocialMediaType).
      success(vm.displayCandidatePics).
      error(function(err){
        vm.logError('Couldn\'t get ' + vm.candidateName + '\'s pics', err);
      });
    };

    vm.displayCandidatePics = function(data) {
      if (data.length === 0) {
        console.log('No user media of candidate ' + vm.candidateName);
        return;
      }
      vm.candidateMedia = data;
      vm.pics = vm.getThumbsURLsfromData(vm.candidateMedia);
    };

    vm.extractCandidateMedia = function(response) {
      return response.data;
    };

    vm.displayPicInMainFrame = function(index){
      vm.candidatePicUrl = vm.getPicUrlFromPics(index);
    };

    vm.getPicUrlFromPics = function(i) {
      return vm.candidateMedia[i].images.standard_resolution.url;
    };

    vm.getThumbsURLsfromData = function(media) {
      var picUrls = [];
      var frames = 0;
      if (media.length < 4) frames = media.length;
      else frames = vm.frames;
      for (var i = 0; i < frames; i++) {
        picUrls.push(media[i].images.thumbnail.url);
      }
      return picUrls;
    };

    vm.getCandidateName = function(data) {
      return data.userName;
    };

    vm.getCandidateProfilePic = function(data) {
      return vm.changeUrlToBiggerPic(data.profilePicture);
    };

    vm.changeUrlToBiggerPic = function(url) {
      return url.replace('s150x150', 's600x600');
    };

    vm.logError = function(msg, err) {
      console.error(msg + ' : ' + err);
    };

    vm.logSuccess = function(msg) {
      console.log(msg);
      //Messages.success = msg;
    };

    vm.init();

  }
})();
