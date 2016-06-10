describe("PoolController", function() {

  beforeEach(module('app.pool'));

  var PoolCtrl;
  var scope;

  beforeEach(inject(function ($controller, $rootScope) {

    scope = $rootScope.$new();

    PoolCtrl = $controller('PoolController', {
      $scope: scope
    });
  }));

  it('should be empty', function() {

    expect(PoolCtrl.candidateName.length).toBe(0);

  });

});
