require('dotenv').config()
var zendesk = require('node-zendesk')
const zendeskUsername = process.env.USERNAME
const zendeskToken = process.env.ZENDESK_TOKEN
const zendeskURI = process.env.URI

const client = zendesk.createClient({
    username: zendeskUsername,
    token: zendeskToken,
    remoteUri: zendeskURI,
})

function getTicketList(doesTicketAlreadyExist) {
    client.tickets.list((err, statusList, body) => {
        console.log('do dis')

        doesTicketAlreadyExist(body)
    })

    //   for (let i = 0; i < body.length; i++) {
    //     const issueUrl = this.getIssueUrl()

    //     if (
    //         body[i]['external_id'] === issueUrl &&
    //         body[i]['status'] !== 'solved'
    //     ) {
    //       return callback(true)
    //     }
    // }
}
function doesTicketAlreadyExist(body) {
    for (let i = 0; i < body.length; i++) {
        if (
            body[i]['external_id'] ===
                'https://github.com/teakopp/it-bot/issues/1' &&
            body[i]['status'] !== 'solved'
        ) {
            console.log(true)

            return true
        }
    }
    console.log(false)
    return false
}

getTicketList(doesTicketAlreadyExist)
