# Why shoud I use it?
Sometimes you need to work with huge amounts of data in the browser. You don't want to, but someone forced your hand. Maybe you need to sort 600 rows of data, calculate some numbers based on every single value in the array, or some other really heavy task. Boom, you have 5+ second browser freezes. This is because *everything* in javascript runs in a single thread, so if something is blocking, everything is blocked. A solution was worked out quite some time ago called web workers, but have not reached widespread adoption because of their limitations and difficulty to implement. 

This project aims to make working with web workers a whole lot easier. 

## How do I use it?
It's really easy. Think angular promises and you'll be good. Execute code like this:
```
  WebWorker.run(function (message) {
    var result = [];
  
    // Really resource-intensive code involving result
  
    return result;

    }).then(function (result) {
      // PostMessage from above returns here when completed
      console.log('result:', result)
  });
```

Calling return in the main function will cause a postMessage to be sent to the main thread with the provided data. The then method is then called with a result parameter containing the returned data. All this happens behind the scenes, and the isolated nature of web workers is a lot easier to deal with.

Web workers are *really* isolated from the rest of the code, so the only way to pass parameters to the function above is via a provided params array after the function. Just calling a variable from an outside scope will always result in undefined. An example of the correct syntax:

```
  WebWorker.run(function (message) {
    var 1 = message.data[0];
    var 2 = message.data[1];
    var 3 = message.data[2];
  
    // Really resource-intensive code involving 1, 2, 3
  
    return result;
  
    }, [1, 2, 3]).then(function (result) {
      console.log('result:', result)
  });
```

You can also implement error handling for errors that occur in the web worker:

```
  WebWorker.run(function () {
  
    throw new Error('This should never happen (Yet somehow it did!)');
  
  }).then(function (result) {
    console.log('Success!');
  }, function (error) {
    console.error('An error occured!', error);
    // Handle the error somehow
  });
```

If a browser [does not support web workers](http://caniuse.com/#feat=webworkers), the method will safely fallback to not using them. Nothing will break, but no code will be run asynchronously, so performance will be the same as if web workers were not implemented.

Because of the isolation built in to web workers, using them comes with some limitations. You cannot:
 - Access or manipulate the DOM, as it does not know about window or document 
 - Call code or functions outside the worker's function
 - Pass functions to the web worker as a parameter, it'll break horribly

You CAN (amongst other things):
 - Access the global browser Navigator object
 - Call XMLHttpRequests
 - Manipulate data using JS' built in methods
 
For more information on what functions are available inside a worker scope, [refer to this page](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Functions_and_classes_available_to_workers).

## How do I install it?
First run:
```
bower install -S web-worker
```
Import the script webworker.js in a script tag in your index.html, and import the module "esphen.web-worker" in your main module (app.js). Then you can simply add "WebWorker" as a dependency to any of your controllers, and et voilà, you're ready to roll with web workers!

### What if I'm living in the past and don't use bower?
That's okay, the project is bundled in a zip file for your convenience. Click [here](https://github.com/esphen/web-worker/raw/master/dist/webworker.zip) to download the most recent stable version.
