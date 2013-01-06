var express = require('express');
var app = express();
var request = require('request');
var loadConfig = require('./configure');

var rootApi = '/blink';

var blinkUri_Play = 'http://localhost:8934/blink1/pattern/play?pname=';

//patterns
var brokenBuild = 'policeFlash';
var buildingFromRed = 'buildingFromRed';
var buildingFromGreen = 'buildingFromGreen';
var successfulBuild = 'successfulBuild';


//Config must be executed first in this file.
var config = require('nconf').get();


app.get(rootApi + '/checkBuild', function(req, res) {

	res.send("#111111");
	play(brokenBuild, function(err, response) {
		
	}.bind(this));


});

function play(pname, callback) {
		console.log("playing...");

	request(blinkUri_Play + pname, function(error,response,body) {
		console.log("### playing blink1 ###");
		console.log(body);

		callback(null, body);
	});
}

app.listen(3000);
console.log('Listening on port 3000');