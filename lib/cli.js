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
    .help('h').alias('h', 'help')
    .usage('Usage: ./$0 [options]')
    .demandOption(['projectId', 'apiEndpoint']);

require('./server')({
    ds: {
        projectId: argv.projectId,
        apiEndpoint: argv.apiEndpoint
    },
    port: argv.port
});