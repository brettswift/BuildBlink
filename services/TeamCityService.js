var TeamCityGateway = require('./../gateways/TeamCityGateway');
var Seq = require('seq');

var TeamCityService = function(config) {
        this.config = config;
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
    getStatusForBuildId: function(buildData, callback) {


    },
    getAllBuilds: function(config, callback) {


        Seq().seq(function() {

            vcsService.getCommitEntries(this);
        }).seq(function(commitEntries) {
            // log.error(util.format('%j',commitEntries));
            var cardBuilder = new CardGroupBuilder();
            cardBuilder.buildCardGroupsAsync(commitEntries, this);
        }).flatten().parMap(5, function(cardGroup) {
            // Retrieve the task card for each commit
            //TODO: push to validation elsewhere
            log.info("going to look for info on: " + cardGroup.compositeKey);
            if(cardGroup.cardNumber === '') {
                log.warn('not handling' + util.format('%j', cardGroup));
                //for now just wrap it in a dummy card group and pop it back on the stack, we can't do anything with it.
                //var emptyCardGroup = new CardGroup().createFromInvalidCardGroup(cardGroup);
                //code above likely not needed.. card group already created.
                fakeReturnCallback(cardGroup, this);
            } else {
                //log.error(util.format('%j', cardGroup));
                var wallServiceName = config.cardWalls[cardGroup.cardWall].service;
                var cardWallService = cardWallServiceFactory.getCardWallService(wallServiceName);
                cardWallService.getCardInfo(cardGroup, this);
                // debugger;
            }
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
    getConfigForSeq: function(callback){
        callback(this.config.teamcityBuildNumbers);
    }
};

module.exports = TeamCityService;