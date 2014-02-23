require('nodetime').profile({
    accountKey: '424ca98a152c4774152cbef2fee0092c998e6377',
    appName: 'buildblink profiler'
  });

var request = require('request');
var colors = require('colors');
var BuildProcess = require('./BuildProcess');

// memwatch:  https://hacks.mozilla.org/2012/11/tracking-down-memory-leaks-in-node-js-a-node-js-holiday-season/

// var agent = require('webkit-devtools-agent');

var pollInterval = 30 * 1000;

// var hd = new memwatch.HeapDiff();
var buildProcess = new BuildProcess(pollInterval);

function keepAlive(){
	buildProcess.checkBuild();
	setTimeout(function () {
		// var diff = hd.end();
		keepAlive();
	}, pollInterval);
}

keepAlive();

// console.log(process.pid);
// require('./profiler.js');