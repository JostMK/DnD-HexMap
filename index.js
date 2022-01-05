process.on('uncaughtException', function(err) {
    console.error((err && err.stack) ? err.stack : err);
});

process.on('exit', function(err) {
    console.log('-----Exiting-----\n\n');
});

process.on('SIGINT', function(err) {
    console.log('-----Forced Exit');
    process.exit();
});


const startServer = require('./server.js');
startServer();