const Datastore = require('@google-cloud/datastore');
const _ = require('lodash');
const jsf = require('json-schema-faker');
const employee = require('./entities/employee');
const company = require('./entities/company');
const seedrandom = require('seedrandom');
const faker = require('faker');

const datastore = new Datastore({
    projectId: process.env.DATASTORE_PROJECT_ID,
    apiEndpoint: process.env.DATASTORE_EMULATOR_HOST
});

jsf.extend('faker', () => faker);

async function seed({ log }){
    faker.seed(1);
    const seedResult = await Promise.all(['', 'ns1', 'ns2'].map(async namespace => {
        const companies = _.times(10, () => jsf(company));
        await Promise.all(companies.map(data =>
            addEntity({
                kind: 'Company',
                data,
                path: ['Company', data.id],
                namespace,
                log
            })
        ));
        await Promise.all(_.times(50, async () => {
            const employeeSchema = employee(companies.map(c => c.id));
            const data = jsf(employeeSchema);
            return addEntity({
                kind: 'Employee',
                data,
                path: ['Company', data.company, 'Employee', data.id],
                namespace,
                log
            });
        }));
    }));
    return seedResult;
}

module.exports = seed;

function addEntity({ kind, data, namespace, path, log = false }) {
    const entity = {
        key: datastore.key({
            namespace,
            path
        }),
        data: Object.keys(data).map(attr => ({
            name: attr,
            value: data[attr],
            ...(attr !== 'id' || attr !== 'name' ? { excludeFromIndexes: true } : {})
        }))
    };

    return datastore.save(entity).then(result => {
        if (log) {
            console.log(`Created ${kind} ${namespace ? `/ ${namespace} ` : ''}${JSON.stringify(data)} successfully.`)
        }
        return result;
    });
}