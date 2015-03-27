# How do I use this?
It's really easy. Think angular promises and you'll be good. Execute code like this:
```
  WebWorker.run(function (message) {
    var result = [];
  
    // Really resource-intensive code involving result
  
    postMessage(result);
  
    }).then(function (result) {
      // PostMessage from above returns here when completed
      console.log("result:", result)
  });
```

To run the then-function, you need to run a postMessage in the main function. This is because the code is run completely separately from the main javascript-thread and there is no way for it to know when it has completed unless it is explicitly told so.

Web workers are *really* isolated from the rest of the code, so the only way to pass parameters to the function above is via a provided params array after the function. Just putting in a variable from an outside scope will always result in undefined. An example of the correct syntax:

```
  WebWorker.run(function (message) {
    var 1 = message.data[0];
    var 2 = message.data[1];
    var 3 = message.data[2];
  
    // Really resource-intensive code involving 1, 2, 3
  
    postMessage(result);
  
    }, [1, 2, 3]).then(function (result) {
      console.log("result:", result)
  });
```

Because of the isolation built in to web workers, using them comes with some limitations. You cannot:
 - Access or manipulate the DOM, as it does not know about window or document 
 - Call code or functions outside the worker's function
 - Pass functions to the web worker as a parameter, it'll break horribly

You CAN (amongst other things):
 - Access the global browser Navigator object
 - Call XMLHttpRequests
 - Manipulate data using JS' built in methods

##How do I install this?
First run:
```
bower install -S web-worker
```
Import the script in a script tag in your index.html, and import the module "esphen.web-worker" in your main module (app.js). Then you can simply add "WebWorker" as a dependency to any of your controllers, and et voilà, you're ready to roll with web workers!
