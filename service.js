var express = require('express');
var app = express();
var request = require('request');
var loadConfig = require('./configure');
var TeamCityService = require('./services/TeamCityService');
var colors = require('colors');
var prettyjson = require('prettyjson');
var Blink1 = require('node-blink1');

var rootApi = '/blink';

//patterns
var brokenBuild = 'brokenBuild';
var newBrokenBuild = 'policeFlash';
var buildingFromRed = 'buildingFromRed';
var buildingFromGreen = 'buildingFromGreen';
var successfulBuild = 'successfulBuild';
var newSuccessfulBuild = 'successfulBuild';

//## HACK - this fixes an https issue, where UNABLE_TO_VERIFY_LEAF_SIGNATURE is returned from a request
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

//Config must be executed first in this file.
var config = require('nconf').get();

var service = new TeamCityService(config);

Blink1.devices(); // returns array of serial numbers
var blink1 = new Blink1(); //uses first serialnumber

//TODO: report precedence, needs to change to this. This doesn't get cached!!!! so it gets reported as new green or new red after.
// 1. if something is building currently, show it.
// 2. if there is a new broken build
// 3. if there is a new green build, flash, but then go back to overall status.
	// 4. if nothing new, go solid to the current state.  Red/Green.

	function checkBuild(){
		var lightPattern = brokenBuild;
		var hasRunningBuild = false;

		// play(brokenBuild, function(err, response) {}.bind(this));
		//TODO: move out of here, and return the playlist code.
		service.getAllBuilds(function(err, buildActivities) {
			console.log("\r\n ----> controling light with result...".white);

			if(areAnyBuildsBuilding(buildActivities)) {
				if(areAnyBuildsBuildingFromRed(buildActivities)) {
					console.log("some builds are building from red".yellow);
					play(buildingFromRed, function(err, response) {});
					return;
				}
				if(areAnyBuildsBuildingFromGreen(buildActivities)) {
					console.log("some builds are building from green".yellow);
					play(buildingFromGreen, function(err, response) {});
					return;
				}
				console.log("...... could not determine if it was building from red or green");
			}

			if(areAllBuildsGreen(buildActivities)) {
				console.log("all builds are green".green);
				if(previousBuildWasNotGreen(buildActivities)) {
					play(newSuccessfulBuild, function(err, response) {});

				} else {
					play(successfulBuild, function(err, response) {});
				}
				return;
			}

			if(areAnyBuildsRed(buildActivities)) {
				console.log("some builds are red".red);
				play(brokenBuild, function(err, response) {});
			}

		});
	};

	function previousBuildWasNotGreen(buildActivities) {

	}

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
	function doPoliceFlash(){
		blink1.fadeToRGB(200, 255, 0, 0,function(){
			blink1.fadeToRGB(400, 255, 0, 0,function(){
				blink1.fadeToRGB(200, 0, 0, 255,function(){
					blink1.fadeToRGB(400, 0, 0, 255,function(){
						// if i should stop, don't call callback
						if(stopflashing){
							stopflashing = false;
						}else{
							doPoliceFlash();
						}
						
					});
				});
			});
		});
	}

	function doRed(){
		
	}


	function play(pname, callback) {
		console.log("playing...");

		doPoliceFlash();
 
		var date = new Date();
		var timestamp = date.toDateString() + " " + date.toLocaleTimeString();

		console.log("[" + timestamp + "] ______ ### playing blink1 ###");
		// 	console.log(body);

	}
	play("policeFlash");
	// checkBuild();