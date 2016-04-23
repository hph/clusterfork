# clusterfork

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
