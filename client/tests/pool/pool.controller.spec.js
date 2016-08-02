describe("PoolController", function() {

  beforeEach(module('app.pool'));

  beforeEach(inject(function ($controller, _PoolService_) {

    PoolCtrl = $controller('PoolController', {
      PoolService: _PoolService_
    });
  }));


  afterEach(inject(function ($httpBackend) {
        // Make sure we have flushed all of our requests.
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

  var PoolCtrl;
  var mockResponse = {
    id: 1,
    isActive: 1,
    profilePicture: '',
    socialId: 11111,
    socialMediaType: 1,
    userName: 'Fedor'
  };

  var mockUserMedia = [];

  var images = {
    low_resolution: {
      height: 200,
      url: '',
      width: 200
    },
    standard_resolution: {
      height: 600,
      url: '',
      width: 600
    },
    thumbnail: {
      height: 150,
      url: '',
      width: 150
    }
  };

  var mediaObject = {
    attribution: null,
    caption: null,
    comments: {},
    created_time: '1467229968',
    filter: 'Normal',
    id: '32434453',
    images: images,
    likes: {},
    link: '',
    location: null,
    tags: [],
    type: 'image',
    user: {},
    user_has_liked: false,
    users_in_photo: []
  };

  mockUserMedia[0] = mediaObject;

  //  it('Should get Candidate', inject(function (PoolService, $httpBackend, $rootScope) {
   //
  //    $httpBackend.when('GET', '/api/nextCandidate').respond(mockResponse);
   //
  //    PoolCtrl.approveCandidate(1);
   //
  //    $httpBackend.flush();
   //
  //    PoolCtrl.isCandidateAvailable.toEqual(true);
   //
  //       $rootScope.$digest();
   //
  //  }));

  it('should call clearProfile and getNextCandidate', inject(function(PoolService, $httpBackend, $rootScope) {

    $httpBackend.when('GET', '/api/nextCandidate').respond(mockResponse);
    $httpBackend.when('POST', '/api/userMedia').respond(mockUserMedia);

    spyOn(PoolCtrl, 'clearProfile');
    // spyOn(PoolService, 'getNextCandidate');

    PoolCtrl.getNextCandidate();

    $httpBackend.flush();

    expect(PoolCtrl.clearProfile).toHaveBeenCalled();

    // $httpBackend.flush();
    //
    // expect(PoolService.getNextCandidate).toHaveBeenCalled();
  }));

});
