require('colors');
require('console.table');
const yargs = require('yargs');

const { argv } = yargs
    .option('p', {
        alias: 'port',
        describe: 'Server Port',
        type: 'number',
        default: 3000
    })
    .options('r', {
        alias: 'projectId',
        describe: 'Project ID',
        type: 'string',
        default: process.env.DATASTORE_PROJECT_ID
    })
    .options('e', {
        alias: 'apiEndpoint',
        describe: 'Datastore API Endpoint',
        type: 'string',
        default: process.env.DATASTORE_EMULATOR_HOST
    })
    .options('k', {
        alias: 'keyFilename',
        describe: 'Private key file path',
        type: 'string'
    })
    .options('f', {
        alias: 'filter',
        describe: 'UI Query Filters',
        type: 'array'
    })
    .help('h').alias('h', 'help')
    .usage('Usage: ./$0 [options]')
    .demandOption(['projectId', 'apiEndpoint']);

require('./server')({
    ds: {
        projectId: argv.projectId,
        apiEndpoint: argv.apiEndpoint,
        keyFilename: argv.keyFilename,
        filters: argv.filter,
    },
    port: argv.port
});