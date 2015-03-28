/**
 * An angular.js module utilizing web workers to execute code asynchronously in a seperate thread
 * @version v0.0.4 - 2015-03-28 * @link https://github.com/esphen/web-worker
 * @author Espen Henriksen <esphendev@icloud.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function ( window, angular, undefined ) {
angular.module('esphen.web-worker', ['ng'])
    .factory('WebWorker', ['$q', function ($q) {
        'use strict';

        /**
         * This function does the following in order:
         *  - Converts passed function to a string so we can process it
         *  - Retrieves param name from passed function
         *  - Converts function to a web worker blob
         *  - Sets message and error handlers
         *  - Initializes and starts worker
         */
        var runWorker = function (fn, params) {
            var deferred = $q.defer();
            var functionBody = fn.toString();

            // Get argument name
            var regexedBody = functionBody.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m);
            var paramName = regexedBody[1] ? regexedBody[1] : '';

            // Self invoke function inside a postMessage
            functionBody = 'onmessage = function(' + paramName + '){postMessage(' + functionBody + '(' + paramName + '))}';

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
            var worker = new Worker(window.URL.createObjectURL(blob));

            // Processed data returns
            worker.onmessage = function(message) {
                deferred.resolve(message.data);
            };
            worker.onerror = function (error) {
                deferred.reject(error);
            };
            // Start worker
            worker.postMessage(params);
            return deferred.promise;
        };

        var makeFallbackFunction = function (fn, params) {
            var deferred = $q.defer();
            deferred.resolve(fn({data: params}));
            return deferred.promise;
        };

        return {
            run: function (fn, params) {
                if (typeof fn !== 'function') {
                    throw new Error('WebWorker: First parameter must be a function');
                }
                if (!!window.Worker) { // Browser supports web workers
                    return runWorker(fn, params);
                } else { // Browser does NOT support web workers, fallback
                    return makeFallbackFunction(fn, params);
                }
            }
        };
    }]);
})( window, window.angular );