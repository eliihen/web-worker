'use strict';

describe('basicTests', function() {
    var WebWorker;

    beforeEach(module('esphen.web-worker'));

    beforeEach(inject(['WebWorker', function (_WebWorker) {
        WebWorker = _WebWorker;
    }]));

    it('should be defined', inject(function() {
        expect(WebWorker).toBeDefined();
    }));

    it('should have a function called run', inject(function() {
        expect(WebWorker.run).toEqual(jasmine.any(Function));
    }));

    it('should return a promise when run is called', inject(function() {
        expect(WebWorker.run(function () {}).then).toBeDefined();
    }));

    it('should throw when not provided with a function', inject(function() {
        expect(WebWorker.run).toThrow(new Error ('WebWorker: First parameter must be a function'));
    }));
});
