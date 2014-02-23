var memwatch = require('memwatch');
memwatch.on('leak', function(info) {
	console.log("----> leak");
	console.log(info);
 });

memwatch.on('stats', function(stats) {
	console.log("----> stats");
	console.log(stats);
 });

