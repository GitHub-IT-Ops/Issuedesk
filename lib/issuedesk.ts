const github = require('@actions/github')
const zendesk = require('node-zendesk')
const IssueMonitor = require('issuemonitor.js')
const TicketMaker = require('ticketmaker.js')
const ZendeskMonitor = require('zendeskmonitor.js')
const ZendeskUpdater = require('zendeskupdater.js')

interface ticket {
    ticket: {
        subject: string
        comment: { body: string }
        external_id: string
    }
}

class Issuedesk{

    octokit: any
    context: any
    zendesk: any
    client: any
    ticket: ticket
    constructor(
        myToken: string,
        zendeskUsername: string,
        zendeskToken: string,
        zendeskURI: string
    ) {
        this.octokit = github.getOctokit(myToken)
        this.context = github.context
        this.client = zendesk.createClient({
            username: zendeskUsername,
            token: zendeskToken,
            remoteUri: zendeskURI,
        })
        this.ticket = {
            ticket: { subject: '', comment: { body: '' }, external_id: '' },
        }
    }


}
