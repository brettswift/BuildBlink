var TeamCityGateway = require('../gateways/TeamCityGateway');
var BuildActivity = require('../domain/BuildActivity');

var Seq = require('seq');


var TeamCityService = function(config, injectableGateway) {
        this.config = config;
        this.gateway = injectableGateway || new TeamCityGateway(config.teamcityHost);
    };

TeamCityService.prototype = {
    getBuildActivityForBuildId: function(buildId, callback) {

        this.gateway.getBuildsForProjectId(buildId, function(err, jsonBuildActivity) {

            //TODO: delegate to a builder to build a json object / pojo instead of decorator.
            var build = new BuildActivity(jsonBuildActivity);

            callback(null, build);
        });
    },
    getAllBuilds: function(callback) {

        var that = this;

        Seq(this.config.teamcityBuildNumbers)
        .flatten()
        .parMap(function(buildConfig) {
            that.getBuildActivityForBuildId(buildConfig.id,this);
        })
        .seq(function(){
            callback(null,this.stack);
        });
    }
};

module.exports = TeamCityService;