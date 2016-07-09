var cluster = require('cluster');
var server = require('./server');

if (cluster.isMaster) {

    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for (var i = 0; i < numWorkers; i++) {
        // start worker process 
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code ' + code);
        console.log('Starting a new worker');

        // start a new worker 5 seconds after the crash, this will prevent 100% cpu load in case app can't start
        setTimeout(function() {cluster.fork()}, 5000)
    });

} else {
    server.initialize();
}