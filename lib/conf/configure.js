var nconf = require('nconf');
var util = require('util');
var fs = require('fs');

// ### Heirarchical Config, those added first take priority.
// 1. any overrides
nconf.overrides({
	// 'always': 'be this value' 
});


// 2. `process.env`
// to  see all environment variables, just use .env();
nconf.env(['PATH', 'conf']);

// 3. `process.argv`
nconf.argv();

console.log("loading config");

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var configFile = getUserHome() + '/.buildblinkrc';

// if(!fs.existsSync(configFile)){
// 	console.error("!!!  No ~/.buildblinkrc file found . . . ");
// }
nconf.file(configFile);

//  Any default values (erase this if loading two files doesn't work).
nconf.defaults({
	'if nothing else': 'use this value'
});

// Setup nconf to use the 'memory' store
nconf.use('memory');
nconf.load();
// Get the entire database object from nconf
var database = nconf.get();
console.log("\r\n#### CONFIGURATION USED: ######");
console.dir(database);
console.log("###############################\r\n");
