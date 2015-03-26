angular.module('esphen.web-worker', ['ng'])
    .factory('WebWorker', function ($q) {
        'use strict';
        return {
            run: function (fn, params) {
                var deferred = $q.defer();
                // Strip wrapper function
                var entire = fn.toString();
                var functionBody = entire.slice(entire.indexOf('function'));
                functionBody = 'onmessage =' + functionBody;

                // URL.createObjectURL
                window.URL = window.URL || window.webkitURL;

                var blob;
                try {
                    blob = new Blob([functionBody], {type: 'application/javascript'});
                } catch (e) { // Backwards-compatibility
                    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
                    blob = new BlobBuilder();
                    blob.append(functionBody);
                    blob = blob.getBlob();
                }
                var worker = new Worker(URL.createObjectURL(blob));

                // Processed data returns
                worker.onmessage = function(e) {
                    deferred.resolve(e.data);
                };
                // Start worker
                worker.postMessage(params);
                return deferred.promise;
            }
        };
    });