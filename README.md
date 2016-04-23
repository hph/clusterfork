# clusterfork

[![Package Version](https://img.shields.io/npm/v/node-clusterfork.svg)](https://www.npmjs.com/package/node-clusterfork)
[![License](https://img.shields.io/npm/l/node-clusterfork.svg)](https://tldrlegal.com/license/mit-license)

A [Node.js cluster](https://nodejs.org/api/cluster.html#cluster_cluster)
abstraction allowing you to run programs clustered without any configuration.

Where you would previously have run `node server.js` you would now run
`clusterfork server.js`.

### Install

Install `clusterfork` for your project:

    npm install --save node-clusterfork

Now modify your `package.json`:

```diff
"scripts": {
- "start": "node server.js"
+ "start": "clusterfork server.js"
}
```

You can also install `clusterfork` globally (for development & testing
purposes):

    npm install -g node-clusterfork

### Features

For a full list of options, run `clusterfork -h`.

##### Debug information

You may get debug information on the state of the master process and the
workers by using the `-v / --verbose` flag.

##### Number of workers

The default behaviour of `clusterfork` is to create a one-to-one mapping to
your CPU cores, thus creating 8 workers if you have 8 cores. You may override
this behaviour with the `-c / --concurrency` option, e.g.:

    clusterfork server.js --concurrency $WEB_CONCURRENCY

##### Automatic restart

If you do not wish `clusterfork` to restart workers automatically when they
die, use the `-n / --no-refork` flag.

### Example

Copy the following code to a file named `server.js`:

```javascript
'use strict';
const createServer = require('http').createServer;

createServer((req, res) => {
  res.end(`Hello from process ${process.pid}`);
}).listen(3000);
```

You can now run the server normally with `node server.js`. Opening
`http://localhost:3000` you should see something like this:

    Hello from process 12345

In this example, `12345` is the
[PID](https://en.wikipedia.org/wiki/Process_identifier) of the server. You can
kill it by running `kill -9 12345`. If you refresh the page, you'll see that
you'll get no response.

Now, assuming you have installed `clusterfork` globally, you can run the server
like this:

    clusterfork server.js -v

You will see the PIDs of the workers in the console (due to `-v`) and if you
open `http://localhost:3000` in the browser, you will get a hello message as
before.

You can see how `clusterfork` restarts processes as they die by killing the
process specified in the browser. If you refresh the page, you'll get a new
PID, from one of the other workers or the newly created one.

### Why?

In many cases there is no need for custom logic to implement clustering. By
using `clusterfork` you can avoid modifying your app's entry point with
clustering boilerplate. It can also be useful just to test an app that
previously had no clustering logic to benchmark the difference or to detect
issues that need to be handled specifically.
