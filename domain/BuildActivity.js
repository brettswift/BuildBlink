var BuildActivity = function(activityData) {
        
        this.currentBuild = activityData.build[0];
        this.previousBuild = activityData.build[1];


};

BuildActivity.prototype = {
	isBuildingFromGreen: function(){
		return !this.isBuildingFromRed();
	},
	isGreen: function(){
		if(this.currentBuild.status != 'SUCCESS'){
			return false;
		}
		if(this.isBuilding()){
			return false;
		}
		return true;
	},
	isBuilding: function(){
		return this.currentBuild.running || false;
	},
	isBuildingFromRed: function(){
		if(this.previousBuild.status == 'FAILURE' ||
			this.previousBuild.status == 'ERROR'){
			return true;
		}
		return false;
	}
};

module.exports = BuildActivity;