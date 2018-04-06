const http = require('http');
const fs = require('fs');
const program = require('commander');
const package = require('./package.json');

function exitError(msg) {
	if (msg) {
		console.error(msg)
	}

	process.exit(1);
}

function streamToServer(input, url, options) {
	if (input == null) exitError('No input file or directory given.');
	if (url == null) exitError('No server URL given.');

	if (options.mount == null) {
		options.mount = require('uuid/v5')();
	}

	console.log(input ,url, options);
}

program.version(package.version);

program.command('stream <input> <url>')
.option('-m, --mount [mount]', 'Name of the mount point. If not given, a uuid (v5) will be used.')
.action(streamToServer);

program.parse(process.argv);
