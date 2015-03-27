angular.module('esphen.web-worker', ['ng'])
    .factory('WebWorker', function ($q) {
        'use strict';
        var runWorker = function (fn, params) {
            var deferred = $q.defer();
            // Strip wrapper function
            var entire = fn.toString();
            var functionBody = entire.slice(entire.indexOf('function'));
            // TODO replace
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
            // Turn postMessage(x) into return x;
            var functionBodyArray = fn.toString().split('postMessage');
            functionBodyArray[1] = 'return ' + functionBodyArray[1].slice(1, functionBodyArray[1].indexOf(')')) + ';' + functionBodyArray[1].slice(indexOf(')') + 1);
            var functionBody = functionBodyArray.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue;
            });
            return eval(functionBody)({data: params});
        };

        return {
            run: function (fn, params) {
                if (!!window.Worker) { // Browser supports web workers
                    return runWorker(fn, params);
                } else { // Browser does NOT support web workers, fallback TODO postMessage
                    fn({data: params});
                }
            }
        };
    });
