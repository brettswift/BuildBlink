var assert = require('assert');
var should = require('should');
var fs = require('fs');

var BuildActivity = require('./../domain/BuildActivity');


suite('BuildActivity', function() {
	var config;
	setup(function() {
		// config = JSON.parse(fs.readFileSync('./conf/default/config.json', "utf8"));
	});


	suite('should_correctly_identify_state_of_build', function() {
		test('should_identify_green_build', function() {
			var buildJson = JSON.parse(fs.readFileSync('./test/samples/sampleBuild_Success.json', "utf8"));
			var activity = new BuildActivity(buildJson);

			should.exist(activity.currentBuild.status, 'currentStatus property does not exist');
			should.exist(activity.previousBuild.status, 'previousStatus property does not exist');

			activity.isGreen().should.be.true;

		});

		test('should_identify_as_building_from_green', function() {
			var buildJson = JSON.parse(fs.readFileSync('./test/samples/sampleBuild_buildingFromSuccess.json', "utf8"));
			var activity = new BuildActivity(buildJson);

			should.exist(activity.currentBuild.status, 'currentStatus property does not exist');
			should.exist(activity.previousBuild.status, 'previousStatus property does not exist');

			activity.isGreen().should.be.false;
			activity.isBuilding().should.be.true;
			activity.isBuildingFromRed().should.be.false;
			activity.isBuildingFromGreen().should.be.true;

		});

		test('should_identify_as_building_from_red', function() {
			var buildJson = JSON.parse(fs.readFileSync('./test/samples/sampleBuild_buildingFromFailure.json', "utf8"));
			var activity = new BuildActivity(buildJson);

			should.exist(activity.currentBuild.status, 'currentStatus property does not exist');
			should.exist(activity.previousBuild.status, 'previousStatus property does not exist');

			activity.isGreen().should.be.false;
			activity.isBuilding().should.be.true;
			activity.isBuildingFromRed().should.be.true;
			activity.isBuildingFromGreen().should.be.false;

		});

		test('should_identify_red_build', function() {
			var buildJson = JSON.parse(fs.readFileSync('./test/samples/sampleBuild_Red.json', "utf8"));
			var activity = new BuildActivity(buildJson);

			should.exist(activity.currentBuild.status, 'currentStatus property does not exist');
			should.exist(activity.previousBuild.status, 'previousStatus property does not exist');

			activity.isGreen().should.be.false;
			activity.isBuilding().should.be.false;

		});

		
		test('should_have_proper_build_token', function() {
			var buildJson = JSON.parse(fs.readFileSync('./test/samples/sampleBuild_Red.json', "utf8"));
			var activity = new BuildActivity(buildJson);

			activity.instanceToken.should.equal('bt4:83');

		});



	});


});