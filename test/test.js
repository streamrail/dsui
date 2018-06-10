require('isomorphic-fetch');
const chai = require('chai');
const { expect } = chai;
const assertArrays = require('chai-arrays');
const assertCheerio = require('chai-cheerio');
const cheerio = require('cheerio');
const getNamespaces = require('./helpers/get-namespaces');
const getKinds = require('./helpers/get-kinds');
const getTableData = require('./helpers/get-table-data');
const assertListPage = require('./helpers/assert-list-page');
const _ = require('lodash');
const url = require('url');
const FormData = require('form-data');
const seed = require('./seed');
const sleep = require('await-sleep');

chai.use(assertArrays);
chai.use(assertCheerio);

const namespaces = ['Default', 'ns1', 'ns2'];
const kinds = ['Company', 'Employee']
describe('DSUI Tests', function() {
    before(async function(){
        console.log('  Start seeding...')
        await seed({ log: false })
        console.log('  Done')
    });

    describe('DSUI Server Acceptance Tests', function() {
        describe('List Page', function(){
            it('should render empty page', async function(){
                const html = await fetch('http://localhost:3000').then(response => response.text());
                const $ = cheerio.load(html);
                expect(getNamespaces($)).to.be.equalTo(namespaces);
                expect(getKinds($)).to.be.equalTo(kinds);
                expect($('#table')).not.to.exist;
            });

            it('should render table of Employees', async function(){
                await assertListPage({
                    namespaces,
                    kinds,
                    kind: 'Employee',
                    page: 1,
                    itemsPerPage: 10,
                    total: 50,
                    start: 1,
                    end: 10
                });
            });

            it('should render table of Employees with page 2 and 5 items per page', async function(){
                await assertListPage({
                    namespaces,
                    kinds,
                    namespace: 'ns1',
                    kind: 'Employee',
                    page: 2,
                    itemsPerPage: 5,
                    total: 50,
                    start: 6,
                    end: 10
                });
            });

            it('should render table of Companies', async function(){
                await assertListPage({
                    namespaces,
                    kinds,
                    kind: 'Company',
                    page: 1,
                    itemsPerPage: 10,
                    total: 10,
                    start: 1,
                    end: 10
                });
            });
        });

        describe('Single Entity Page', function(){
            it('should render a single Employee with all attributes fields values', async function(){
                const listHtml = await fetch('http://localhost:3000?kind=Employee').then(response => response.text());
                const tableData = getTableData(cheerio.load(listHtml));
                const singleEntityHtml = await fetch(url.resolve('http://localhost:3000', tableData[0]['__singleEntityUrl'])).then(response => response.text());
                const $ = cheerio.load(singleEntityHtml);

                // Assert title has key value
                expect($('#entity_key')).to.have.text(tableData[0]['Key']);

                // Assert entity attributes presence and values
                _.without(Object.keys(tableData[0]), 'Key', '__singleEntityUrl').forEach(attr => {
                    expect($(`label[for="field_${attr}"]`)).to.exist;
                    expect($(`input#field_${attr}`)).to.exist;
                    expect($(`input#field_${attr}`)).to.exist;
                    expect($(`input#field_${attr}`)).to.have.value(tableData[0][attr]);
                });
            });
        });

        describe('Delete Entities', function(){
            it('should delete first page employees entities', async function(){
                this.timeout(10000);
                const listHtml = await fetch('http://localhost:3000?kind=Employee').then(response => response.text());
                const tableData = getTableData(cheerio.load(listHtml));
                const keys = tableData.map(row => row.__singleEntityUrl.replace('/entities/', ''));
                const form = keys.reduce((f, key) => {
                    f.append('keys', key)
                    return f;
                }, new FormData)
                const body = keys.map(key => `keys=${key}`).join('&');

                const newListHtml = await fetch('http://localhost:3000/delete-entities', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                        Referer: 'http://localhost:3000?kind=Employee',
                    },
                    body
                }).then(response => response.text());
                
                const newTableData = getTableData(cheerio.load(newListHtml));
                const newKeys = newTableData.map(row => row.__singleEntityUrl.replace('/entities/', ''));
                keys.forEach(key => {
                    expect(newKeys).not.to.be.containing(key);
                });
            });
        });
    });
})