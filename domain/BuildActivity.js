//This is a decorator for the teamcity build json object.
//TODO: push this into a plain json object, and use a builder to build it. 
var BuildActivity = function(activityData) {

		this.currentBuild = activityData.build[0];
		this.previousBuild = activityData.build[1];

		//ID is unique across teamcity, could just use that.
		this.instanceToken = this.currentBuild.buildTypeId + ':' + this.currentBuild.id;
	};

BuildActivity.prototype = {
	isBuildingFromGreen: function() {
		return !this.isBuildingFromRed();
	},
	isGreen: function() {
		if(this.currentBuild.status != 'SUCCESS') {
			return false;
		}
		if(this.isBuilding()) {
			return false;
		}
		return true;
	},
	isBuilding: function() {
		return this.currentBuild.running || false;
	},
	isBuildingFromRed: function() {
		if(this.previousBuild.status == 'FAILURE' || this.previousBuild.status == 'ERROR') {
			return true;
		}
		return false;
	}
};

module.exports = BuildActivity;