var vsprintf = require('sprintf').sprintf;
var request = require('request');
var prettyjson = require('prettyjson');

var TeamCityGateway = function(server) {
	this.server = server; //TODO: remove hard coded default after integration tests.
};

//TODO: branches should be removed - this is just to easily test build transition on a throw away branch. 
//TODO: support for both https and http
var uriBuildLocatorBase = 'http://%s/guestAuth/app/rest/buildTypes/id:%s/builds?locator=running:any,branch:(unspecified:any),lookupLimit:2';

TeamCityGateway.prototype = {
	getBuildsForProjectId: function(projectId, callback) {
		if (!projectId) {
			callback("Hmmmm...  you asked me to check a null build.", undefined);
			return;
		}

		var uri = vsprintf(uriBuildLocatorBase, this.server, projectId);

		console.log('\rSending request to: ' + uri);
		var options = {
			url: uri,
			method: 'GET',
			json: true,
			headers: {
				'accept': 'application/json'
			}
		};

		request(options, function(error, response, body) {
			if (error) {
				console.log(error);
				// if you get UNABLE_TO_VERIFY_LEAF_SIGNATURE
				// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
				callback(error, null);
			}
			if (response.statusCode == 404) {
				callback(vsprintf("Build %s not found", projectId));
			}
			// console.log(prettyjson.render(body));

			callback(null, body);
		});
	}
};

module.exports = TeamCityGateway;