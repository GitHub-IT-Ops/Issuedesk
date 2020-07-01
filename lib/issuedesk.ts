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

    async monitorIssueAndMakeTicket(activationLabel: string) {
        const issueMonitor = new IssueMonitor(this.octokit, this.context)
        const labelData = issueMonitor.getLabelEventData()

        for (let i = 0; i > activationLabel.length; i++) {
            if (activationLabel === labelData) {
                const ticketMaker = new TicketMaker(this.client)
                const listOfComments = await issueMonitor.getListOfComments()
                const issueUrl = issueMonitor.getIssueUrl()
                const issueTitle = issueMonitor.getIssueTitle()
                const ticketSubject = issueMonitor.getIssueTitle()
                ticketMaker.generateTicketSubject(ticketSubject)
                await ticketMaker.createTicketIfItDoesNotExist(
                    issueUrl,
                    issueTitle,
                    listOfComments
                )

                return true
            } else {
                return false
            }
        }
    }
}

export { IssueDesk }
