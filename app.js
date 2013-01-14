var express = require('express');
var app = express();
var request = require('request');
var loadConfig = require('./configure');
var TeamCityService = require('./services/TeamCityService');
var colors = require('colors');

var rootApi = '/blink';

var blinkUri_Play = 'http://localhost:8934/blink1/pattern/play?pname=';

//patterns
var brokenBuild = 'policeFlash';
var buildingFromRed = 'buildingFromRed';
var buildingFromGreen = 'buildingFromGreen';
var successfulBuild = 'successfulBuild';
var newSuccessfulBuild = 'successfulBuild';


//Config must be executed first in this file.
var config = require('nconf').get();

var service = new TeamCityService(config);

//TODO: report precedence, needs to change to this. This doesn't get cached!!!! so it gets reported as new green or new red after.  
// 1. if something is building currently, show it. 
// 2. if there is a new broken build
// 3. if there is a new green build, flash, but then go back to overall status. 
// 4. if nothing new, go solid to the current state.  Red/Green.


app.get(rootApi + '/checkBuild', function(req, res) {
	var lightPattern = brokenBuild;
	var hasRunningBuild = false;
	res.send("#111111");

	// play(brokenBuild, function(err, response) {}.bind(this));
	//TODO: move out of here, and return the playlist code. 
	service.getAllBuilds(function(err, buildActivities) {
		console.log("\r\n ----> controling light with result...".white);
		if(areAllBuildsGreen(buildActivities)) {
			console.log("all builds are green".green);
			if(previousBuildWasNotGreen(buildActivities)) {
				play(newSuccessfulBuild, function(err, response) {});

			} else {
				play(successfulBuild, function(err, response) {});
			}
			return;
		}

		if(areAnyBuildsBuilding(buildActivities)) {
			if(areAnyBuildsBuildingFromRed()) {
				console.log("some builds are building from red".orange);
				play(buildingFromRed, function(err, response) {});
				return;
			}
			if(areAnyBuildsBuildingFromGreen(buildActivities)) {
				console.log("some builds are building from green".yellow);
				play(buildingFromGreen, function(err, response) {});
				return;
			}
		}

		if(areAnyBuildsRed(buildActivities)) {
			console.log("some builds are building from red".red);
			play(brokenBuild, function(err, response) {});
		}

	});
});

function previousBuildWasNotGreen(buildActivities){

}
function areAllBuildsGreen(buildActivities) {
	for(var i in buildActivities) {
		if(!buildActivities[i].isGreen()) {
			return false;
		}
	}
	return true;
}

function areAnyBuildsBuilding(buildActivities) {
	for(var i in buildActivities) {
		if(buildActivities[i].isBuilding()) {
			return true;
		}
	}
	return false;
}

function areAnyBuildsBuildingFromRed(buildActivities) {
	for(var i in buildActivities) {
		if(buildActivities[i].isBuildingFromRed()) {
			return true;
		}
	}
	return false;
}

function areAnyBuildsBuildingFromGreen(buildActivities) {
	for(var i in buildActivities) {
		if(buildActivities[i].isBuildingFromGreen()) {
			return true;
		}
	}
	return false;
}

function areAnyBuildsRed(buildActivities) {
	for(var i in buildActivities) {
		if(buildActivities[i].isRed()) {
			return true;
		}
	}
	return false;
}



function play(pname, callback) {
	console.log("playing...");

	request(blinkUri_Play + pname, function(error, response, body) {
		var date = new Date();
		var timestamp = date.toDateString() + " " + date.toLocaleTimeString();

		console.log("[" + timestamp + "] ______ ### playing blink1 ###");
		console.log(body);

		callback(null, body);
	});
}

app.listen(3000);
console.log('Listening on port 3000');