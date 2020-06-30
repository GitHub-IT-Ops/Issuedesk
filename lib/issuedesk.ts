import { ticketType } from '../types/types.js'
const github = require('@actions/github')
const zendesk = require('node-zendesk')
const IssueMonitor = require('./issuemonitor.js').IssueMonitor
const TicketMaker = require('./ticketmaker.js').TicketMaker

class IssueDesk {
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

    async monitorIssueAndMakeTicket() {
        
        const issueMonitor = await new IssueMonitor(this.octokit, this.context)
        const ticketMaker = await new TicketMaker(this.client)
        const listOfComments = await issueMonitor.getListOfComments()
        const issueUrl = await issueMonitor.getIssueUrl()
        await ticketMaker.generateTicketBody(listOfComments, issueUrl)
        await ticketMaker.createTicketIfItDoesNotExist()

    }
}

export { IssueDesk }
