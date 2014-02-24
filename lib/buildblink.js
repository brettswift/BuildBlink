var request = require('request');
var colors = require('colors');
var BuildProcess = require('./BuildProcess');
var Setup = require('./conf/setup');
var loadConfig;

var setup = new Setup();
setup.configure();
// load this only after setup has ensured the config file exists
loadConfig = require('./conf/configure');

//Config must be executed first in this file.
var config = require('nconf').get();

var pollInterval = 30 * 1000;
var buildProcess = new BuildProcess(pollInterval, config);

function buildblink(){
	buildProcess.checkBuild();
	setTimeout(function () {
		buildblink();
	}, pollInterval);
}

module .exports = buildblink;
