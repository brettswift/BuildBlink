var TeamCityGateway = require('../gateways/TeamCityGateway.js');
var BuildActivity = require('../domain/BuildActivity');

var Seq = require('seq');

var TeamCityService = function(config, injectableGateway) {
        this.config = config;
        this.gateway = injectableGateway || new TeamCityGateway();
    };

TeamCityService.prototype = {

    getBuildStatus: function(callback) {

        var TeamCityGateway = new TeamCityGateway(config.teamCityUri);
        TeamCityGateway.getXml(function(err, xml) {
            //log.info(logs);
            if(err !== null) {
                callback(err, null);
                return;
            }

        }.bind(this));
    },
    getBuildActivityForBuildId: function(buildId, callback) {

        this.gateway.getBuildsForProjectId(buildId, function(err, jsonBuildActivity) {

            var build = new BuildActivity(jsonBuildActivity);

            callback(null, build);
        })
    },
    getAllBuilds: function(config, callback) {

        Seq().seq(function() {
            this.getConfigForSeq(this);
        }).seq(function(stuff) {
            console.log(stuff);
        }).flatten().parMap(5, function(configSection) {

        }).seq(function() {
            // for(var i in this.stack){
            //     cardCollection.addCard(this.stack[i]);
            // }
            var allCardGroups = this.stack;
            output.sortCardGroupsIntoCategories(allCardGroups, this);
            // Collect all of our task cards in one place
        }).seq(function(categoryGroups) {
            // Render our task cards into an output format
            categoryGroups = wrap(categoryGroups, config);
            // log.info(util.format('%j', categoryGroups));
            renderer.renderOutput(categoryGroups, this);
        });
    },
    getConfigForSeq: function(callback) {
        callback(this.config.teamcityBuildNumbers);
    }
};

module.exports = TeamCityService;