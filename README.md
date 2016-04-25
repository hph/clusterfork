# clusterfork

[![Package Version](https://img.shields.io/npm/v/node-clusterfork.svg)](https://www.npmjs.com/package/node-clusterfork)
[![License](https://img.shields.io/npm/l/node-clusterfork.svg)](https://tldrlegal.com/license/mit-license)

An abstraction over the
[Node.js cluster API](https://nodejs.org/api/cluster.html#cluster_cluster)
allowing you to run programs clustered with little or no configuration
([why?](#why)).

It's as simple as running `clusterfork server.js` instead of `node server.js`!

* [Installation](#installation)
* [Usage](#usage)
  * [Via the command-line interface](#via-the-command-line-interface)
  * [As an npm script](#as-an-npm-script)
  * [Programmatically](#programmatically)
* [Features](#features)
  * [Debug information](#debug-information)
  * [Number of workers](#number-of-workers)
  * [Automatic restart](#automatic-restart)
* [Interactive example](#interactive-example)
* [Why](#why)

### Installation

Install `node-clusterfork` to your project, saving it in `package.json`:

    npm install -S node-clusterfork

If you just want to try `node-clusterfork` out, you may also install it
globally:

    npm install -g node-clusterfork

### Usage

##### Via the command-line interface

If you have `node-clusterfork` installed globally, you can run a Node.js
program (usually a web server) like this:

    clusterfork server.js

You might want to pass the `-v / --verbose` flag as well, to get a better idea
of what's going on behind the scenes.

##### As an npm script

Node.js programs are often run via the `npm start` command. For that to work,
you will have to edit your `package.json` in this fashion:

```diff
"scripts": {
- "start": "node server.js"
+ "start": "clusterfork server.js"
}
```

Note that `node-clusterfork` should be installed normally, not globally, for
the above example.

##### Programmatically

If you'd rather not do any of the above, and prefer the explicitness of code,
you might want to use `node-clusterfork` programmatically:

```javascript
'use strict';
const clusterfork = require('node-clusterfork');
const createServer = require('http').createServer;

const server = createServer((req, res) => {
  res.end(`Hello from process ${process.pid}`);
});

clusterfork(() => server.listen(3000), { verbose: true });
```

The above example starts a clustered server listening on port 3000. The only
thing done differently from normal is that instead of calling `server.listen`
directly, the call is passed along as an anonymous function to
`node-clusterfork`.

### Features

For a full list of options, run `clusterfork -h`.

##### Debug information

You may get debug information on the state of the master process and the
workers by using the `-v / --verbose` flag.

##### Number of workers

The default behaviour of `node-clusterfork` is to create a one-to-one mapping
to your CPU cores, thus creating 8 workers if you have 8 cores. You may
override this behaviour with the `-c / --concurrency` option, e.g.:

    clusterfork server.js --concurrency $WEB_CONCURRENCY

##### Automatic restart

If you do not wish `node-clusterfork` to restart workers automatically if they
die, use the `-n / --no-refork` flag. Note that this option is called `refork`
(not `noRefork`) when passing options as an object to the `clusterfork`
function.

### Interactive example

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

Now, assuming you have installed `node-clusterfork` globally, you can run the
server like this:

    clusterfork server.js -v

You will see the PIDs of the workers in the console (due to `-v`) and if you
open `http://localhost:3000` in the browser, you will get a hello message as
before.

You can see how `node-clusterfork` restarts processes as they die by killing
the process specified in the browser. If you refresh the page, you'll get a new
PID, from one of the other workers or the newly created one.

### Why

Node.js is single-threaded and cannot take advantage of multiple cores by
default. It also has a low hard memory limit. To take full advantage of all 
resources, you must fork processes, also called clustering. This can be done
via [Node.js cluster API](https://nodejs.org/api/cluster.html#cluster_cluster)
or by using a library such as `clusterfork`.

In many cases there is no need for custom logic to implement clustering. By
using `clusterfork` you can avoid modifying your app's entry point with
clustering boilerplate and try out different configurations with ease. The
optimal clustering configuration is highly dependent on the server's resources.
Heroku has some
[examples](https://devcenter.heroku.com/articles/node-concurrency#defaults) of
sane numbers of workers for clustering on their various server types.
