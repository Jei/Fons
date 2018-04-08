const http = require('http');
const fs = require('fs');
const program = require('commander');
const request = require('request');
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

	const {
		mount = require('uuid/v5'),
		username,
		password
	} = options;

	const requestOptions = {
		url: url + '/' + options.mount,
	}

	if (username && password) {
		requestOptions.headers = {
			'Authentication': `Basic ${username}:${password}`,
		};
	}

	fs.createReadStream(input).pipe(request.put(requestOptions, (err, resp, body) => {
		console.log('err', err);
		console.log('resp', resp);
		console.log('code', resp.statusCode);
	}));
}

program.version(package.version);

program.command('stream <input> <url>')
.option('-m, --mount [mount]', 'Name of the mount point. If not given, a uuid (v5) will be used.')
.option('-u, --username [username]', 'Username of the source.')
.option('-p, --password [password]', 'Password of the source.')
.action(streamToServer);

program.parse(process.argv);
