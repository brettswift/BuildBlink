var assert = require('assert');
var should = require('should');

var TeamCityService = require('./../services/TeamCityService.js');
var fs = require('fs');

suite('TeamcityService', function() {
	var config;
	setup(function() {
		// config = JSON.parse(fs.readFileSync('./conf/default/config.json', "utf8"));
	});

	suite('constructor', function() {
		test('should_create_TeamCityGateway', function() {
			var service = new TeamCityService("testServer");
			// assert.equal(service.server, "testServer");
		});
	});

	suite('getBuildForId', function() {
		test('should_get_all_builds_for_project_id', function(done) {
 
			var service = new TeamCityService(config);



			done();
		});
	});
});