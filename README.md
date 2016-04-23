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

### Why?

In many cases there is no need for custom logic to implement clustering. By
using `clusterfork` you can avoid modifying your app's entry point with
clustering boilerplate. It can also be useful just to test an app that
previously had no clustering logic to benchmark the difference or to detect
issues that need to be handled specifically.
