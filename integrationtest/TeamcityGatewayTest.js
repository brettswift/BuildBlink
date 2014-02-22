var assert = require('assert');
var should = require('should');

var TeamCityGateway = require('./../gateways/TeamCityGateway.js');
var fs = require('fs');

suite('TeamCityGateway', function() {
	var config;
	setup(function() {
		// config = JSON.parse(fs.readFileSync('./conf/default/config.json', "utf8"));
	});

	suite('constructor', function() {
		test('should_create_TeamCityGateway', function() {
			var gateway = new TeamCityGateway("testServer");
			assert.equal(gateway.server, "testServer");
		});
	});

	suite('getBuildForId', function() {
		test('should_get_all_builds_for_project_id', function(done) {

			var gateway = new TeamCityGateway(config);

			gateway.getBuildsForProjectId('BranchingTest_Build', function(err,result) {
				result.count.should.be.above(-1);
			});

			done();
		});
	});
});