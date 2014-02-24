var fs = require('fs');
var prompt = require('sync-prompt').prompt;

var Setup = function() {};

Setup.prototype = {
	configExists: function() {
		return fs.existsSync(this.getConfigFile());
	},
	getUserHome: function() {
		return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
	},
	getConfigFile: function() {
		return this.getUserHome() + '/.buildblinkrc';
	},
	configure: function() {
		if (!this.configExists()) {
			console.log("no configuration file exists.");
			this.gatherConfig();
			return true;
		}
	},
	gatherConfig: function() {
		console.log("Configure your first build:");
		var teamcityServer = prompt('What is your Teamcity Server? (ip/fqdn and port.  No http)\r\n --> ');
		var id = prompt('What is the buildtype id? \r\n --> ');
		var name = prompt('What is the friendly name of this build? \r\n --> ');

		var config = {};
		config.teamcityHost = teamcityServer;
		config.teamcityBuildNumbers = [
			{
				"name": name,
				"id":  id
			}
		];

		configContents = JSON.stringify(config, null, 4);
		console.log(configContents);
		fs.writeFileSync(this.getConfigFile(), configContents);
		console.log("Thank you.  Checking builds . . . ");
	}
};

module.exports = Setup;