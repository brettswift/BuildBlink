var assert = require('assert');
var should = require('should');
var colors = require('colors');
var prettyjson = require('prettyjson');
var loadConfig = require('./../configure');

var PatternController = require('./../controllers/PatternController.js');
var BuildActivity = require('./../domain/BuildActivity.js');

var fs = require('fs');

suite('PatternController', function() {
	var config;
	var sut;
	var mockService;

	setup(function() {
		// config = JSON.parse(fs.readFileSync('./config.json', "utf8"));
		config = require('nconf').get();
		sut = new PatternController(config, mockService);

	});

	suite('constructor', function() {
		test('should_create_PatternController', function() {
			sut.should.be.a('object').and.have.property('service', mockService);
		});
	});

	suite('determinePatternToPlay', function() {
		test('should_return_greenBuild', function(done) {
			var stubBuildActivity = JSON.parse(fs.readFileSync('./test/samples/buildActivity/success.json', "utf8"));
			sut.getBuildActivity = function(callback){
				callback(null,stubBuildActivity);
			};

			sut.determinePatternToPlay(function(err, pattern) {
				// console.log(prettyjson.render(result));
				pattern.should.be.a('string');
				pattern.should.equal('successfulBuild');
				done();
			});
		});

		test('should_return_newSuccessfulBuild', function(done) {
			var stubBuildActivity = JSON.parse(fs.readFileSync('./test/samples/buildActivity/success.json', "utf8"));
			sut.getBuildActivity = function(callback){
				callback(null,stubBuildActivity);
			};

			sut.determinePatternToPlay(function(err, pattern) {
				// console.log(prettyjson.render(result));
				pattern.should.be.a('string');
				pattern.should.equal('newSuccessfulBuild');
				done();
			});
		});

		test('should_return_building_from_green', function(done) {
			var stubBuildActivity = JSON.parse(fs.readFileSync('./test/samples/buildActivity/buildingFromGreen.json', "utf8"));
			sut.getBuildActivity = function(callback){
				callback(null,stubBuildActivity);
			};

			sut.determinePatternToPlay(function(err, pattern) {
				// console.log(prettyjson.render(result));
				pattern.should.be.a('string');
				pattern.should.equal('buildingFromGreen');
				done();
			});
		});

		test('should_return_building_from_red', function(done) {
			var stubBuildActivity = JSON.parse(fs.readFileSync('./test/samples/buildActivity/buildingFromRed.json', "utf8"));
			sut.getBuildActivity = function(callback){
				callback(null,stubBuildActivity);
			};

			sut.determinePatternToPlay(function(err, pattern) {
				// console.log(prettyjson.render(result));
				pattern.should.be.a('string');
				pattern.should.equal('buildingFromRed');
				done();
			});
		});

		test('should_return_redBuild', function(done) {
			var stubBuildActivity = JSON.parse(fs.readFileSync('./test/samples/buildActivity/redBuild.json', "utf8"));
			sut.getBuildActivity = function(callback){
				callback(null,stubBuildActivity);
			};

			sut.determinePatternToPlay(function(err, pattern) {
				// console.log(prettyjson.render(result));
				pattern.should.be.a('string');
				pattern.should.equal('redBuild');
				done();
			});
		});

		test('should_return_newRedBuild', function(done) {
			var stubBuildActivity = JSON.parse(fs.readFileSync('./test/samples/buildActivity/redBuild.json', "utf8"));
			sut.getBuildActivity = function(callback){
				callback(null,stubBuildActivity);
			};

			sut.determinePatternToPlay(function(err, pattern) {
				// console.log(prettyjson.render(result));
				pattern.should.be.a('string');
				pattern.should.equal('policeFlash');
				done();
			});
		});
	});

});