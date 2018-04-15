module.exports = options => {
	const app = require('./app')(options);
	const debug = require('debug')('dsui:server');
	const http = require('http');
	const port = normalizePort(process.env.PORT || options.port);

	app.set('port', port);

	const server = http.createServer(app);

	server.listen(port);
	server.on('error', onError);
	server.on('listening', onListening);

	function normalizePort(val) {
		const port = parseInt(val, 10);

		if (isNaN(port)) {
			// named pipe
			return val;
		}

		if (port >= 0) {
			// port number
			return port;
		}

		return false;
	}

	function onError(error) {
		if (error.syscall !== 'listen') {
			throw error;
		}

		const bind = typeof port === 'string'
			? 'Pipe ' + port
			: 'Port ' + port;

		// handle specific listen errors with friendly messages
		switch (error.code) {
			case 'EACCES':
				console.error(bind + ' requires elevated privileges');
				process.exit(1);
				break;
			case 'EADDRINUSE':
				console.error(bind + ' is already in use');
				process.exit(1);
				break;
			default:
				throw error;
		}
	}

	function onListening() {
		const addr = server.address();
		const bind = typeof addr === 'string'
			? 'pipe ' + addr
			: 'port ' + addr.port;
		debug('Listening on ' + bind);
		const logObject = {
			'Server URL': `http://localhost:${addr.port}`.cyan,
			'Project ID': options.ds.projectId
		};
		if (options.ds.apiEndpoint) {
			logObject['API Endpoint'] = options.ds.apiEndpoint;
		}
		console.table('Datastore UI Server'.green, [logObject]);
	}

};