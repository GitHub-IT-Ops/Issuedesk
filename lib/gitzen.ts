const github = require('@actions/github')
const zendesk = require('node-zendesk')

interface ticket {
    ticket: {
        subject: string
        comment: { body: string }
        external_id: string
    }
}

class Gitzen {
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
        this.octokit = new github.GitHub(myToken)
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

    returnContext() {
        return this.context
    }

    public getTicketInfo(ticketID: string) {
        this.client.ticket.show(ticketID, (data: any) => {
            console.log(data)
        })
    }

    private isCorrectLabel(label: string) {
        if (this.context.payload.label.name == label) {
            return true
        } else {
            return false
        }
    }

    private setExternalId(externalId: string) {
        return (this.ticket['ticket']['external_id'] = externalId)
    }

    // This function gets all ticket data and passes it into doesTicketAlreadyExist()
    // as a callback. Didn't aabstract it because it is not meant for long term use.
    // getTicketList() and doesTicketAlreadyExist() have been split into two functions
    // in order to utilize node's callback mechanism, instead of await. This is due to node-zendesk 2.0.0 & 1.5.0 bug.
    // Once resolved please combine into one function and use await for consistency
    private getTicketList(doesTicketAlreadyExist: (arg0: any) => void) {
        this.client.tickets.list((err: any, statusList: any, body: any) => {
            console.log('do dis')

            doesTicketAlreadyExist(body)
        })
    }

    private getIssueNumber() {
        return this.context.payload.issue.number
    }

    private getRepoOwner() {
        return this.context.payload.repository.owner.login
    }

    private getRepoName() {
        return this.context.payload.repository.name
    }

    private getIssueUrl() {
        return this.context.payload.issue.url
    }

    private getLabelEventData() {
        return this.context.payload.label
    }

    private getIssueId() {
        return this.context.payload.label
    }

    public issueWasLabeled() {
        if (this.context.payload.action == 'labeled') {
            return true
        } else {
            return false
        }
    }

    public async getListOfComments() {
        const owner = this.getRepoOwner()
        const repo = this.getRepoName()
        const issue_number = this.getIssueNumber()
        const listOfComments = await this.octokit.issues.listComments({
            owner,
            repo,
            issue_number,
        })
        return listOfComments.data
    }

    public async generateTicketBody() {
        const issueThread = await this.getListOfComments()
        let ticketBody = ''
        for (let i = 0; i < issueThread.length; i++) {
            const commenter = issueThread[i].user.login
            const createdAt = issueThread[i].created_at
            const comment = issueThread[i].body
            ticketBody += `Author: ${commenter}\nComment: ${comment} \n*Created at: ${createdAt}*\n\n`
        }
        ticketBody += `\n\n\nOriginal issue can be found at ${this.getIssueUrl}`
        this.ticket['ticket']['comment']['body'] = ticketBody
        return ticketBody
    }

    public generateTicketSubject() {
        this.ticket['ticket']['subject'] = this.getIssueUrl()
        return this.ticket
    }

    public async generateTicket() {
        this.setExternalId(this.getIssueUrl())
        this.generateTicketSubject()
        await this.generateTicketBody()
    }

    public createTicket() {
        console.log(this.ticket)

        this.client.tickets.create(
            this.ticket,
            (err: any, req: any, result: any) => {
                if (err) return handleError(err)
                console.log(JSON.stringify(result, null, 2))
                console.log('Ticket created!')
            }
        )

        function handleError(err: any) {
            console.log(err)
            process.exit(-1)
        }
    }

    // This function is made to parse data from getTicketList() and return whether ticket already exists. It returns true or false.
    // It exists to prevent duplicate tickets from being created and prevent tickets not being opened if original is closed as Solved
    // and then reopened.
    // Split into a seperate function due to node-zendesks 2.0.0 & 1.5.0 version issues at the time.
    // Use of callbacks like this function and getTicketList() should only be used until issue is resolved
    // in node-zendesk library.
    public doesTicketAlreadyExist(body: string | any[]) {
        const issueUrl = this.getIssueUrl

        for (let i = 0; i < body.length; i++) {
            if (
                body[i]['external_id'] === issueUrl &&
                body[i]['status'] !== 'solved'
            ) {
                console.log(true)
                return true
            }
        }
        console.log(false)
        return false
    }
}

export { Gitzen }
