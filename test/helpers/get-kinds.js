module.exports = $ => $('#kind option')
    .filter((i, option) => !$(option).attr('disabled'))
    .map((i, option) => $(option).text())
    .toArray();