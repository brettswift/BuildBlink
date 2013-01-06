var assert = require('assert');
var should = require('should');

var TeamCityService = require('./../services/TeamCityService.js');
var fs = require('fs');

suite('TeamcityService', function() {
	var config;
	var service;
	var mockGateway;

	setup(function() {
		config = JSON.parse(fs.readFileSync('./config.json', "utf8"));
		service = new TeamCityService(config,mockGateway);
	});

	suite('constructor', function() {
		test('should_create_TeamCityService', function() {
			service.should.be.a('object').and.have.property('gateway', mockGateway);
		});
	});

	suite('getBuildForId', function() {
		test('should_get_all_builds_for_project_id', function(done) {

			//TODO: me.
			don();

		});
	});
});