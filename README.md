# How do I use this?
It's really easy. Think angular promises and you'll be good. Import the script in a script tag, and import the module "esphen.web-worker" in your main module (app.js). Execute code like this:
```
  WebWorker.run(function (message) {
  var result = [];
  
  // Really resource-intensive code involving result
  
  postMessage(result);
  
  }, [...params, accessed as message.data above. Not required]).then(function (result) {
      // PostMessage from above returns here when completed
      console.log("result:", result)
  });
```

Web workers are *really* isolated from the rest of the code, so the only way to pass parameters to the function above is via the params array after the function. Just putting in a variable from an outside scope will always result in undefined.

Finally: A function cannot be a parameter, it'll break horribly.
