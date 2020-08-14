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
    issueMonitor: any
    ticketMaker: any
    zendeskMonitor: any

    constructor(
        myToken: string,
        zendeskUsername: string,
        zendeskToken: string,
        zendeskURI: string
    ) {
        this.issueMonitor = new IssueMonitor(
            github.getOctokit(myToken),
            github.context
        )
        this.ticketMaker = new TicketMaker()
        this.zendeskMonitor = new ZendeskMonitor(this.client)
        this.client = zendesk.createClient({
            username: zendeskUsername,
            token: zendeskToken,
            remoteUri: zendeskURI,
        })
    }

    public getIssueAction() {
        return this.issueMonitor.getEventAction()
    }

    public doesIssueLabelMatchActivationLabel(
        activationLabel: string,
        labelName: string
    ) {
        if (activationLabel === labelName) {
            return true
        } else {
            return false
        }
    }

    // This function will analyze whether an action should be taken by the IssueDesk class, in event of an issue being labeled
    // Takes argument activationLabel, which is then compared to the labelName.
    // labelName is extracted from this.context info by issueMonitor.getLabelName()
    // If label passes check, IssueDesk extracts info needed to create a zendesk ticket.
    // IssueDesk uses an instance of class TicketMaker to generate a ticket and then create it in zendesk.
    // It does this by using the zendesk.client passed to TicketMaker instance
    public async monitorIssueAndMakeTicket(activationLabel: string) {
        const labelName = this.issueMonitor.getLabelName()
        if (activationLabel === labelName) {
            const listOfComments = await this.issueMonitor.getListOfComments()
            const issueUrl = this.issueMonitor.getIssueUrl()
            const issueTitle = this.issueMonitor.getIssueTitle()
            const issueBody = this.issueMonitor.getIssueBody()
            const issueAuthor = this.issueMonitor.getIssueAuthor()
            const timeIssueCreatedAt = this.issueMonitor.getTimeIssueCreatedAt()

            this.ticketMaker.setExternalId(issueUrl)
            this.ticketMaker.generateTicketBody(
                issueBody,
                issueAuthor,
                timeIssueCreatedAt,
                issueUrl
            )

            for(let i=0; i < listOfComments.length; i++){
                const githubHandle = listOfComments[i]["user"]["login"]
                const commentBody =  listOfComments[i]["body"]
                const createdAt = listOfComments[i]["created_at"]
                this.ticketMaker.generateTicketComment(githubHandle, commentBody, createdAt)
            }
            
            await this.zendeskMonitor.createTicketIfItDoesNotExist(issueTitle, this.ticketMaker.getTicketBody(), issueUrl)
            return true
        } else {
            console.log(
                `${labelName} is not an activation label. Ticket will not be created`
            )
            return false
        }
    }

    public async updateTicket(activationLabel: string) {
        const labeData = this.issueMonitor.getIssueLabels()
        for (let i = 0; i < labeData.length; i++) {
            const labelName = labeData[i]['name']
            if (activationLabel === labelName) {
                this.ticketMaker
                this.zendeskMonitor.updateTicketWithIssueComment()
                break
            }
        }
    }
}

export { IssueDesk }
