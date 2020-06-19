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


function getTicketList() {
    client.tickets.list((err, statusList, body) => {
        return doesTicketAlreadyExist(body)
    })

}

function doesTicketAlreadyExist(body) {

    for (let i = 0; i < body.length; i++) {
      console.log("\n");
      console.log(body[i]);
      console.log(body[i]['external_id'] ==='https://api.github.com/repos/teakopp/it-bot/issues/1')
      console.log(body[i]['status'] !== 'solved')
      console.log(body[i]['external_id'] === 'https://api.github.com/repos/teakopp/it-bot/issues/1' && body[i]['status'] !== 'solved');
      
      console.log("\n");
        if (
            body[i]['external_id'] ===
                'https://github.com/teakopp/it-bot/issues/1' &&
            body[i]['status'] !== 'solved'
        ) {
            console.log(true)
            test(true)
            return true
        }
    }
    test(false)
    return false
}


async function test(ticketExists){

    if (ticketExists) {
        console.log('Ticket already exists! Exiting...')
    } else {
        console.log('This would create a ticket')

        // await generateTicket();
        // createTicket();
    }

}

getTicketList()