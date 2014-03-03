var request = require('request');
var colors = require('colors');
var prettyjson = require('prettyjson');
var Blink1 = require('node-blink1');
var TeamCityService = require('./services/TeamCityService');

var BuildProcess = function(pollInterval, config) {
	this.pollInterval = pollInterval || 30 * 1000;
	this.pollInterval = this.pollInterval - 2500; //hack to prevent odd behaviour, before refactoring.
	this.stopflashing = false;
	this.blink1 = new Blink1(); //uses first serialnumber

	this.config = config;
};

//## HACK - this fixes an https issue, where UNABLE_TO_VERIFY_LEAF_SIGNATURE is returned from a request
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// TODO: get rid of this timing chaos.  Instead of actions, pass new state to 
//  a light controller. 
BuildProcess.prototype = {
	checkBuild: function() {
		var hasRunningBuild = false;
		var service = new TeamCityService(this.config);
		var that = this;
		// play(brokenBuild, function(err, response) {}.bind(this));
		//TODO: move out of here, and return the playlist code.
		service.getAllBuilds(function(err, buildActivities) {
			// console.log("\r\n ----> controling light with result...".white);
			var date = new Date();
			var timestamp = date.toDateString() + " " + date.toLocaleTimeString();

			// console.log(buildActivities);
			// console.log(this);
			process.stdout.write(timestamp + "  ");
			if (that._areAnyBuildsBuilding(buildActivities)) {
				if (that._areAnyBuildsBuildingFromRed(buildActivities)) {
					console.log("some builds are building from red".yellow);
					that._setRedToYellow();
					return;
				}
				if (that._areAnyBuildsBuildingFromGreen(buildActivities)) {
					console.log("some builds are building from green".yellow);
					that._setGreenToYellow();
					return;
				}
				console.log("...... could not determine if it was building from red or green");
			}

			if (that._areAllBuildsGreen(buildActivities)) {
				console.log("all builds are green".green);
				if (buildActivities[0].isFreshlyGreen) {
					that._setNewGreen();
				} else {
					that._setGreen();
				}
				return;
			}

			if (that._areAnyBuildsRed(buildActivities)) {
				console.log("some builds are red".red);
				if (buildActivities[0].isFreshlyRed) {
					that._setPoliceFlash();
				} else {
					that._setRed();
				}
			}

		});
	},
	_areAllBuildsGreen: function(buildActivities) {
		if (buildActivities.length === 0) {
			console.error("No builds found");
			return false;
		}
		for (var i in buildActivities) {
			if (!buildActivities[i].isGreen) {
				return false;
			}
		}
		return true;
	},
	_areAnyBuildsBuilding: function(buildActivities) {
		for (var i in buildActivities) {
			if (buildActivities[i].isBuilding) {
				return true;
			}
		}
		return false;
	},
	_areAnyBuildsBuildingFromRed: function(buildActivities) {
		for (var i in buildActivities) {
			if (buildActivities[i].isBuildingFromRed) {
				return true;
			}
		}
		return false;
	},
	_areAnyBuildsBuildingFromGreen: function(buildActivities) {
		for (var i in buildActivities) {
			if (buildActivities[i].isBuildingFromGreen) {
				return true;
			}
		}
		return false;
	},
	_areAnyBuildsRed: function(buildActivities) {
		for (var i in buildActivities) {
			if (buildActivities[i].isRed) {
				return true;
			}
		}
		return false;
	},
	_cycleColors: function(fromRGB, toRGB, fadeDelay) {
		fadeDelay = fadeDelay || 1;
		var that = this;
			try{
				that._doFade(200 + fadeDelay, fromRGB.r, fromRGB.g, fromRGB.b, function() {
					that._doFade(400, fromRGB.r, fromRGB.g, fromRGB.b, function() { //hold this color by fading to the same color
						that._doFade(200 + fadeDelay, toRGB.r, toRGB.g, toRGB.b, function() {
							that._doFade(400, toRGB.r, toRGB.g, toRGB.b, function() { //hold color again, TODO: cleaner way?
								if (that.stopflashing) {
									// stopflashing = false;
									// console.log("was asked to stop flashing with: ");
									// console.log(fromRGB);
									// console.log(toRGB);
								} else {
									that._cycleColors(fromRGB, toRGB, fadeDelay);
								}
							});
						});
					});
				});
		}catch(err){
			console.log(err);
			that._cycleColors(fromRGB, toRGB, fadeDelay);
		}
	},
	_doFade: function(fadeDelay, r, g, b, callback){
		try{
				this.blink1.fadeToRGB(fadeDelay, r, g, b,  callback);
		}catch(err){
			console.log(err);
			this.blink1 = new Blink1(); //re-connect
			callback(fadeDelay, fromRGB, toRGB);
		}
	},
	_setColor: function(r, g, b) {
		// console.log("setting color: " + r + "," + g + "," + b);
		var that = this;
		try{
			that.stopflashing = true;
			// setTimeout(function() { // 2 second grace period for light to finish cycle
				that.blink1.fadeToRGB(100, r, g, b, function() {});

			// }, that.pollInterval);
		}catch(err){
			console.log(err);
			this.blink1 = new Blink1(); //re-connect
		}
	},
	_setPoliceFlash: function() {
		var that = this;
		that.stopflashing = false;
		that._cycleColors({
			r: 0,
			g: 0,
			b: 255
		}, {
			r: 255,
			g: 0,
			b: 0
		});
		setTimeout(function() {
			stopflashing = true;
		}, that.pollInterval);
	},
	_setRedToYellow: function() {
		var that = this;
		that.stopflashing = false;
		that._cycleColors({
			r: 255,
			g: 255,
			b: 0
		}, {
			r: 255,
			g: 0,
			b: 0
		}, 1000);
		setTimeout(function() {
			that.stopflashing = true;
		}, that.pollInterval);
	},
	_setGreenToYellow: function() {
		var that = this;
		that.stopflashing = false;
		that._cycleColors({
			r: 255,
			g: 255,
			b: 0
		}, {
			r: 0,
			g: 255,
			b: 0
		}, 1000);
		setTimeout(function() {
			stopflashing = true;
		}, that.pollInterval);
	},
	_setGreen: function() {
		stopflashing = true;
		this._setColor(0, 255, 0);
	},
	_setNewGreen: function() {
		var that = this;
		that.stopflashing = false;
		that._cycleColors({
			r: 0,
			g: 0,
			b: 0
		}, {
			r: 0,
			g: 255,
			b: 0
		});
		setTimeout(function() {
			stopflashing = true;
		}, that.pollInterval);
	},
	_setRed: function() {
		this.stopflashing = true;
		this._setColor(255, 0, 0);
	}

};

module.exports = BuildProcess;