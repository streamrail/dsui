const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const _ = require('lodash');

module.exports = $ => {
    cheerioTableparser($);
    const data = $('table').parsetable(true, true, false);
    data.shift(); // remove checkboxes columns
    data.push(['__singleEntityUrl', ...data[0].slice(1, data[0].length).map(item => cheerio.load(item)('a').attr('href'))]);
    data[0] = ['Key', ...data[0].slice(1, data[0].length).map(item => cheerio.load(item)('a').text())];
    const array = _.times(data[0].length - 1, () => ({}));
    data.forEach(column => {
        column.slice(1, column.length).forEach((value, i) => {
            array[i][column[0]] = value;
        });
    });
    return array;
};