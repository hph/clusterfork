'use strict';

const cluster = require('cluster');
const cpus = require('os').cpus;
const existsSync = require('fs').existsSync;
const join = require('path').join;

const merge = require('lodash.merge');

const packageJson = require('../package.json');


// Set default options in the global scope, as they're required by various
// methods. These can be overridden by the user of the program.
let OPTIONS = {
  verbose: false,
  refork: true
};

/**
 * Log messages to the console if in verbose mode.
 */
function debug () {
  if (OPTIONS.verbose) {
    console.log.apply(console, arguments);
  }
}

/**
 * Create workers for the cluster as specified by options.
 * 
 * @param {Object} options The options passed to the program.
 */
function createWorkers (options) {
  const workers = options.concurrency || cpus().length;
  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }
}

/**
 * Start the worker, either by calling a function or requiring a file.
 *
 * @param {Function|String} forkee Function to call or file to require.
 */
function startWorker (forkee) {
  if (typeof forkee === 'function') {
    return forkee();
  } else {
    const fullpath = join(process.cwd(), forkee);
    if (existsSync(fullpath)) {
      require(fullpath);
    } else {
      console.log('File "%s" not found', file);
    }
  }
}

/**
 * The entry point of the program. Creates worker processes and then
 * starts the workers.
 *
 * @param {Function|String} forkee Function to call or file to require.
 * @param {Object} options The options passed to the program.
 */
function clusterfork (forkee, options) {
  OPTIONS = merge(OPTIONS, options);
  if (cluster.isWorker) {
    startWorker(forkee);
  } else {
    createWorkers(OPTIONS);
  }
}

cluster.on('fork', (worker) => {
  debug('created worker (pid=%d)', worker.process.pid);
});

cluster.on('exit', (worker, code, signal) => {
  const reason = signal || code;
  debug('worker (pid=%d) died (%s)', worker.process.pid, signal || code);
  if (OPTIONS.refork) {
    cluster.fork();
  }
});


module.exports = clusterfork;
