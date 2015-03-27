'use strict';

describe('filterWatcherProvider', function() {

  var WebWorker;

  beforeEach(module('esphen.web-worker'));

  beforeEach(inject(['WebWorker', function (_WebWorker) {
    WebWorker = _WebWorker;
  }]));

  it('should have a function called run', inject(function() {
    expect(WebWorker.run).toEqual(jasmine.any(Function));
  }));

  it('should return a promise when run is called', inject(function() {
    expect(WebWorker.run(function () {}).then).toBeDefined();
  }));

  it('should throw when not provided with a funciton', inject(function() {
    expect(WebWorker.run).toThrow('WebWorker: First parameter must be a function');
  }));

  // TODO Unit test web worker if possible
  xit('should handle errors in passed functions', inject(function() {
    var runnable = function() { throw 'From inside worker' };
    expect(function () { WebWorker.run(runnable) }).toThrow('From inside worker');
  }));

  // TODO Unit test web worker if possible
  xit('should run a function and return a result', inject(function($rootScope, $q) {
    var data;
    // set up a deferred
    var deferred = $q.defer();
    // get promise reference
    var promise = deferred.promise;

    // set up promise resolve callback
    promise.then(function (response) {
      console.log("response:", response)
      data = response.success;
    });

    WebWorker.run(function () {
      console.log("In worker:")
      return 'foo';
    }).then(function (result) {
      console.log("result:", result)
      deferred.resolve(result);
    });

    // force `$digest` to resolve/reject deferreds
    $rootScope.$digest();

    // make your actual test
    console.log("data:", data)
    expect(data).toEqual('foo');
  }));
});