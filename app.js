var request = require('request');
var colors = require('colors');
var BuildProcess = require('./BuildProcess');

var pollInterval = 10 * 1000;
var buildProcess = new BuildProcess(pollInterval);

function keepAlive(){
	buildProcess.checkBuild();
	setTimeout(function () {
		keepAlive();
	}, pollInterval);
}

keepAlive();
