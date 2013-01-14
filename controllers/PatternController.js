var TeamCityService = require('../services/TeamCityService');
var BuildActivity = require('../domain/BuildActivity');

var lastKnownBuilds = [];

var PatternController = function(config, injectableService) {
        this.config = config;
        this.service = injectableService || new TeamCityService(config);
    };

PatternController.prototype = {
    determinePatternToPlay: function(callback) {
        this.getBuildActivity(function(err,buildActivity){

            callback(null,"");

        });//.bind(this);

    },
    getBuildActivity: function(callback) {
        service.getAllBuilds(function(err, buildActivities) {
            if(err) {
                callback(err);
            }

            callback(null, buildActivities);
        });
    }
};

module.exports = PatternController;