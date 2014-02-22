var request = require('request');
var loadConfig = require('./configure');
var TeamCityService = require('./services/TeamCityService');
var colors = require('colors');
var prettyjson = require('prettyjson');
var Blink1 = require('node-blink1');

var pollInterval;

var BuildProcess = function(pollInterval) {
	pollInterval = pollInterval || 30 * 1000;
	pollInterval = pollInterval - 1000; //hack to prevent odd behaviour, before refactoring.
};

//## HACK - this fixes an https issue, where UNABLE_TO_VERIFY_LEAF_SIGNATURE is returned from a request
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

//Config must be executed first in this file.
var config = require('nconf').get();

var service = new TeamCityService(config);

var pollInterval = 9 * 1000 ;

Blink1.devices(); // returns array of serial numbers
var blink1 = new Blink1(); //uses first serialnumber

//TODO: report precedence, needs to change to this. This doesn't get cached!!!! so it gets reported as new green or new red after.
// 1. if something is building currently, show it.
// 2. if there is a new broken build
// 3. if there is a new green build, flash, but then go back to overall status.
	// 4. if nothing new, go solid to the current state.  Red/Green.

BuildProcess.prototype = {

	checkBuild: function(){
		var hasRunningBuild = false;

		// play(brokenBuild, function(err, response) {}.bind(this));
		//TODO: move out of here, and return the playlist code.
		service.getAllBuilds(function(err, buildActivities) {
			// console.log("\r\n ----> controling light with result...".white);
			var date = new Date();
			var timestamp = date.toDateString() + " " + date.toLocaleTimeString();

			console.log(buildActivities);

			process.stdout.write(timestamp + "  ");
			if(areAnyBuildsBuilding(buildActivities)) {
				if(areAnyBuildsBuildingFromRed(buildActivities)) {
					console.log("some builds are building from red".yellow);
					setRedToYellow();
					return;
				}
				if(areAnyBuildsBuildingFromGreen(buildActivities)) {
					console.log("some builds are building from green".yellow);
					setGreenToYellow();
					return;
				}
				console.log("...... could not determine if it was building from red or green");
			}

			if(areAllBuildsGreen(buildActivities)) {
				console.log("all builds are green".green);
				if(buildActivities[0].isFreshlyGreen) {
					setNewGreen();
				} else {
					setGreen();
				}
				return;
			}

			if(areAnyBuildsRed(buildActivities)) {
				console.log("some builds are red".red);
				if(buildActivities[0].isFreshlyRed) {
					setPoliceFlash();
				}else{
					setRed();
				}
			}

		});
	}
};



	function areAllBuildsGreen(buildActivities) {
		for(var i in buildActivities) {
			if(!buildActivities[i].isGreen) {
				return false;
			}
		}
		return true;
	}

	function areAnyBuildsBuilding(buildActivities) {
		for(var i in buildActivities) {
			if(buildActivities[i].isBuilding) {
				return true;
			}
		}
		return false;
	}

	function areAnyBuildsBuildingFromRed(buildActivities) {
		for(var i in buildActivities) {
			if(buildActivities[i].isBuildingFromRed) {
				return true;
			}
		}
		return false;
	}

	function areAnyBuildsBuildingFromGreen(buildActivities) {
		for(var i in buildActivities) {
			if(buildActivities[i].isBuildingFromGreen) {
				return true;
			}
		}
		return false;
	}

	function areAnyBuildsRed(buildActivities) {
		for(var i in buildActivities) {
			if(buildActivities[i].isRed) {
				return true;
			}
		}
		return false;
	}


	var stopflashing = false;
	function cycleColors(fromRGB, toRGB, fadeDelay){
		fadeDelay = fadeDelay || 1;
		blink1.fadeToRGB(200 + fadeDelay, fromRGB.r, fromRGB.g, fromRGB.b,function(){
			blink1.fadeToRGB(400, fromRGB.r, fromRGB.g, fromRGB.b,function(){ //hold this color by fading to the same color
				blink1.fadeToRGB(200 + fadeDelay, toRGB.r, toRGB.g, toRGB.b,function(){
					blink1.fadeToRGB(400, toRGB.r, toRGB.g, toRGB.b,function(){  //hold color again, TODO: cleaner way?
						if(stopflashing){
							// stopflashing = false;
						}else{
							cycleColors(fromRGB,toRGB, fadeDelay);
						}
					});
				});
			});
		});
	}

	function setColor(r,g,b){
		stopflashing = true;
		setTimeout(function () { // 2 second grace period for light to finish cycle
			blink1.fadeToRGB(200, r, g, b,function(){});
		}, 2000);
	}

	function setPoliceFlash(){
		stopflashing = false;
		cycleColors({r:0,g:0,b:255},{r:255,g:0,b:0});
		setTimeout(function () {
			stopflashing = true;
			setColor(255,0,0);
		}, pollInterval);
	}

	function setRedToYellow(){
		stopflashing = false;
		cycleColors({r:255,g:0,b:0},{r:255,g:255,b:0},1000);
		setTimeout(function () {
			stopflashing = true;
			setColor(255,0,0);
		}, pollInterval);
	}

	function setGreenToYellow(){
		stopflashing = false;
		cycleColors({r:0,g:255,b:0},{r:255,g:255,b:0}, 1000);
		setTimeout(function () {
			stopflashing = true;
			setColor(0,255,0);
		}, pollInterval);
	}

	function setGreen(){
		stopflashing = true;
		setColor(0,255,0);
	}

	function setNewGreen(){
		stopflashing = false;
		cycleColors({r:0,g:0,b:0},{r:0,g:255,b:0});
		setTimeout(function () {
			stopflashing = true;
			setGreen();
		}, pollInterval);
	}

	function setRed(){
		stopflashing = true;
		setColor(255,0,0);
	}

module.exports = BuildProcess;