module.exports = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            faker: {
                'random.alphaNumeric': [7]
            }
        },
        name: {
            type: 'string',
            faker: 'company.companyName'
        },
        country: {
            type: 'string',
            faker: 'address.countryCode'
        }
    },
    required: ['id', 'name']
};