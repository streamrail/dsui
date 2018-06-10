module.exports = companies => ({
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
            faker: 'name.findName'
        },
        job: {
            type: 'string',
            faker: 'name.jobTitle'
        },
        company: {
            type: 'string',
            faker: {
                'random.arrayElement': [companies]
            }
        }
    },
    required: ['id', 'name', 'job', 'company']
});