#!/usr/bin/env node
// 'use strict';
// var cli = require('../lib/cli');
var buildblink = require('../lib/');

//TODO: this is a nice to have:
// var updateNotifier = require('update-notifier'),
// checks for available update and returns an instance
// notifier = updateNotifier({ packagePath: '../package' });

// if (notifier.update) {
//   // notify using the built-in convenience method
//   notifier.notify();
// }

// taken from nodemon - maybe a simpler option parsing program?
//  ie: redirect to setup module if in setup mode?
// var options = cli.parse(process.argv);

buildblink();