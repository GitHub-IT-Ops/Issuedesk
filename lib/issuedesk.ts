const github = require('@actions/github')
const zendesk = require('node-zendesk')
const IssueMonitor = require('./issuemonitor.js').IssueMonitor
const TicketMaker = require('./ticketmaker.js').TicketMaker
const ZendeskMonitor = require('./zendeskmonitor.js').ZendeskMonitor

//Passes github & zendesk instances into issuedesk class so that children classes can use them.
//issuedesk class exists primarily to delegate takes to child classes and handle higher order processes, such as deciding whether event even requires action
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

    // This function will analyze whether an action should be taken by the IssueDesk class, in event of an issue being labeled
    // Takes argument activationLabel, which is then compared to the labelName.
    // labelName is extracted from this.context info by issueMonitor.getLabelName()
    // If label passes check, IssueDesk extracts info needed to create a zendesk ticket.
    // IssueDesk uses an instance of class TicketMaker to generate a ticket and then create it in zendesk.
    // It does this by using the zendesk.client passed to TicketMaker instance
    async monitorIssueAndMakeTicket(activationLabel: string) {
        const issueMonitor = new IssueMonitor(this.octokit, this.context)
        const labelName = issueMonitor.getLabelName()

        if (activationLabel === labelName) {
            const ticketMaker = new TicketMaker()
            const zendeskMonitor = new ZendeskMonitor(this.client)
            const listOfComments = await issueMonitor.getListOfComments()
            const issueUrl = issueMonitor.getIssueUrl()
            const issueTitle = issueMonitor.getIssueTitle()
            const issueBody = issueMonitor.getIssueBody()
            const issueAuthor = issueMonitor.getIssueAuthor()
            const timeIssueCreatedAt = issueMonitor.getTimeIssueCreatedAt()

            ticketMaker.generateTicketSubject(issueTitle)
            ticketMaker.setExternalId(issueUrl)
            ticketMaker.generateTicketBody(
                issueBody,
                issueAuthor,
                timeIssueCreatedAt,
                listOfComments,
                issueUrl
            )

            const ticket = await ticketMaker.getTicket()
            zendeskMonitor.getAllZendeskTickets()
            await zendeskMonitor.createTicketIfItDoesNotExist(ticket)
            return true
        } else {
            console.log(
                `${labelName} is not an activation label. Ticket will not be created`
            )
            return false
        }
    }
}

export { IssueDesk }
