'use strict';

describe('fallbackTests', function() {
    var WebWorker, preservedWorker = window.Worker;

    beforeEach(module('esphen.web-worker'));

    beforeEach(inject(['WebWorker', function (_WebWorker) {
        WebWorker = _WebWorker;
        window.Worker = undefined;
    }]));

    afterEach(inject(function () {
        // Reset worker
        window.Worker = preservedWorker;
    }));

    it('should fallback when browser does not support workers', inject(function ($rootScope) {
        var variable;
        WebWorker.run(function () {
            return 'foo';
        }).then(function (result) {
            variable = result;
        });
        // Resolve .then
        $rootScope.$digest();
        expect(variable).toEqual('foo');
    }));

    it('should process variables in fallback mode', inject(function ($rootScope) {
        var variable;
        WebWorker.run(function (message) {
            return message.data.a + message.data.b;
        }, {a: 5, b: 3}).then(function (result) {
            variable = result;
        });
        // Resolve .then
        $rootScope.$digest();
        expect(variable).toEqual(8);
    }));
});
