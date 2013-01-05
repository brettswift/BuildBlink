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

	play(brokenBuild, function(err, response) {

		res.send(response);

	});

});

function play(pname, callback) {

	request(blinkUri_Play + pname, function(error,response,body) {

		callback(null, body);

	});
}

app.listen(3000);
console.log('Listening on port 3000');