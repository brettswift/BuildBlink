var request = require('request');
var colors = require('colors');
var BuildProcess = require('./BuildProcess');

var pollInterval = 30 * 1000;
var buildProcess = new BuildProcess(pollInterval);

function buildblink(){
	buildProcess.checkBuild();
	setTimeout(function () {
		buildblink();
	}, pollInterval);
}

module .exports = buildblink;
