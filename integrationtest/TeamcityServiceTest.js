var assert = require('assert');
var should = require('should');
var colors = require('colors');
var prettyjson = require('prettyjson');

var TeamCityService = require('./../services/TeamCityService.js');
var BuildActivity = require('./../domain/BuildActivity.js');

var fs = require('fs');

suite('TeamcityService', function() {
	var config;
	var service;
	var mockGateway;

	setup(function() {
		config = JSON.parse(fs.readFileSync('./config.json', "utf8"));
		service = new TeamCityService(config, mockGateway);
	});

	suite('constructor', function() {
		test('should_create_TeamCityService', function() {
			service.should.be.a('object').and.have.property('gateway', mockGateway);
		});
	});

	suite('getBuildActivityForBuildId', function() {
		test('should_return_build_activity', function(done) {

			service.getBuildActivityForBuildId('bt4', function(err, result) {
				// console.log(prettyjson.render(result));
				result.should.be.an.instanceof(BuildActivity, "BuildActivity");
				done();
			});
		});

	});
});