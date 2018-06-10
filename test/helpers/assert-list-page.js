const { expect } = require('chai');
const getNamespaces = require('./get-namespaces');
const getKinds = require('./get-kinds');
const cheerio = require('cheerio');
const qs = require('qs');
module.exports = async ({ namespaces, kinds, kind, namespace = '', page, total, itemsPerPage, start, end }) => {
    const html = await fetch(`http://localhost:3000?${qs.stringify({
        kind,
        page,
        itemsPerPage,
        namespace
    })}`).then(response => response.text());
    const $ = cheerio.load(html);
    expect(getNamespaces($)).to.be.equalTo(namespaces);
    expect(getKinds($)).to.be.equalTo(kinds);
    expect($(`option[value="${kind}"]`), `${kind} is not the selected kind`).to.be.selected;
    expect($(`option[value="${namespace}"]`), `${namespace || 'Default'} is not the selected namespace`).to.be.selected;
    expect($('tbody tr').length, `table items length is not ${itemsPerPage}`).to.equal(itemsPerPage);
    expect($('.page-item.active').text(), `not rendering page ${page}`).to.equal(page.toString());
    expect($('nav p').text(), 'total items is not 50').to.equal(`Showing ${start} - ${end} of ${total}`);
    expect($(`option[value="${itemsPerPage}"]`), `itemsPerPage should be ${itemsPerPage}`).to.be.selected;
}