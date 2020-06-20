import {ticketType} from '../types/types.js'
const github = require('@actions/github')
const zendesk = require('node-zendesk')
const IssueMonitor = require('issuemonitor.js')
const TicketMaker = require('ticketmaker.js')
const ZendeskMonitor = require('zendeskmonitor.js')
const ZendeskUpdater = require('zendeskupdater.js')

class Issuedesk{

    octokit: any
    context: any
    zendesk: any
    client: any
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
    }

    

    async monitorIssueAndMakeTicket(){
        const issueMonitor = new IssueMonitor(this.context, this.octokit)
        const ticketMaker = new TicketMaker(this.client)
        const listOfComments = await issueMonitor.getListOfComments()
        await ticketMaker.generateTicketBody(listOfComments)
        await ticketMaker.createIfTicketDoesntExist()
    }


}

export { Issuedesk }
