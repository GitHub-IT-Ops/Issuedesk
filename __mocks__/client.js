const zendesk = require('node-zendesk')
const client = zendesk.createClient({
    username: 'example@zendesk.com',
    token: 'dsadsadx',
    remoteUri: 'https://example.zendesk.com/api/v2',
})

module.exports = client
