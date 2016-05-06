'use strict';

const cluster = require('cluster');
const cpus = require('os').cpus;
const join = require('path').join;

const defaults = require('lodash.defaults');
const times = require('lodash.times');


/**
 * The entry point of the program. Configures the cluster
 * in the master process and then creates workers.
 *
 * If `forkee` is a function, the worker processes will simply execute it.
 * However, if `forkee` is a string it is assumed to be a path and worker
 * processes will run the file at that path instead.
 *
 * @param {Function|String} forkee Function to call or file to require.
 * @param {Object} options The options passed to the program.
 */
function clusterfork (forkee, options) {
  options = defaults(options, { verbose: false, refork: true });

  const log = message => options.verbose && console.log(message);

  if (cluster.isMaster) {
    if (typeof forkee === 'string') {
      cluster.setupMaster({ exec: join(process.cwd(), forkee) });
    }

    cluster
      .on('fork', (worker) => {
        log(`created worker (pid=${worker.process.pid})`);
      })
      .on('listening', (worker, addr) => {
        log(`worker (pid=${worker.process.pid}) listening on ${addr.port}`);
      })
      .on('exit', (worker, code, signal) => {
        log(`worker (pid=${worker.process.pid}) died (${signal || code})`);
        if (options.refork && code > 0) {
          cluster.fork();
        }
      });

    times(options.concurrency || cpus().length, cluster.fork);
  } else {
    forkee();
  }
}


module.exports = clusterfork;
