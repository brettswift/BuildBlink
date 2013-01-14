//This is a decorator for the teamcity build json object.
//TODO: push this into a plain json object, and use a builder to build it. 
var BuildActivity = function(activityData) {

		this.currentBuild = activityData.build[0];
		this.previousBuild = activityData.build[1];

		//ID is unique across teamcity, could just use that.
		this.instanceToken = this.currentBuild.buildTypeId + ':' + this.currentBuild.id;
		this.setProperties();
	};

BuildActivity.prototype = {
	setProperties: function(){
		// this.props = {};
		this.isBuildingFromGreen = this._isBuildingFromGreen();
		this.isGreen = this._isGreen();
		this.isBuilding = this._isBuilding();
		this.isBuildingFromRed = this._isBuildingFromRed();
		this.isRed = this._isRed();
	},
	_isBuildingFromGreen: function() {
		return !this._isBuildingFromRed();
	},
	_isGreen: function() {
		if(this.currentBuild.status != 'SUCCESS') {
			return false;
		}
		if(this._isBuilding()) {
			return false;
		}
		return true;
	},
	_isBuilding: function() {
		return this.currentBuild.running || false;
	},
	_isBuildingFromRed: function() {
		if(this.previousBuild.status == 'FAILURE' || this.previousBuild.status == 'ERROR') {
			return true;
		}
		return false;
	},
	_isRed: function(){
		if(!this._isBuilding() && !this._isGreen()){
			return true;
		}
		return false;
	}
};

module.exports = BuildActivity;