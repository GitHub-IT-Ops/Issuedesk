import { ticketType, listOfCommentsType } from '../types/types.js'

class Ticketmaker {
    client: any
    ticket: ticketType
    constructor(client: any, octokit: any, context: any) {
        this.client = client
        this.ticket = {
            ticket: { subject: '', comment: { body: '' }, external_id: '' },
        }
    }

    public getTicketInfo(ticketID: string) {
        this.client.ticket.show(ticketID, (data: any) => {
            console.log(data)
        })
    }

    private setExternalId(externalId: string) {
        return (this.ticket['ticket']['external_id'] = externalId)
    }

    //Call this function
    // This function gets all ticket data and passes it into doesTicketAlreadyExist()
    // as a callback. Didn't aabstract it because it is not meant for long term use.
    // createIfTicketDoesntExist() and doesTicketAlreadyExist() have been split into two functions
    // in order to utilize node's callback mechanism, instead of await. This is due to node-zendesk 2.0.0 & 1.5.0 bug.
    // Once resolved please combine into one function and use await for consistency
    private createIfTicketDoesntExist(
        doesTicketAlreadyExist: (arg0: any) => void
    ) {
        this.client.tickets.list((err: any, statusList: any, body: any) => {
            doesTicketAlreadyExist(body)
        })
    }

    public async generateTicketBody(
        listOfComments: [listOfCommentsType],
        issueUrl: string
    ) {
        let ticketBody = ''

        for (let i = 0; i < listOfComments.length; i++) {
            const commenter = listOfComments[i].user.login
            const createdAt = listOfComments[i].created_at
            const comment = listOfComments[i].body
            ticketBody += `Author: ${commenter}\nComment: ${comment} \n*Created at: ${createdAt}*\n\n`
        }

        ticketBody += `\n\n\nOriginal issue can be found at ${issueUrl}`
        this.ticket['ticket']['comment']['body'] = ticketBody
        return ticketBody
    }

    public generateTicketSubject(issueTitle: string) {
        this.ticket['ticket']['subject'] = issueTitle
        return this.ticket
    }

    public async generateTicket(
        issueUrl: string,
        issueTitle: string,
        listOfComments: [listOfCommentsType]
    ) {
        this.setExternalId(issueUrl)
        this.generateTicketSubject(issueTitle)
        await this.generateTicketBody(listOfComments, issueUrl)
    }

    private createTicket() {
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

    // I hate that this function is neccesary. This is one of the 3 functions made to offset the bug in node-zendesk that prevents promises from working.
    // This function exists soley to complete the creation process by nesting inside doesTicketAlreadyExist(). Remove as soon as possible in favor of async / await
    private async ticketCreation(
        ticketExists: boolean,
        issueUrl: string,
        issueTitle: string,
        listOfComments: [listOfCommentsType]
    ) {
        if (ticketExists) {
            console.log('Ticket already exists! Exiting...')
        } else {
            console.log('This would create a ticket')

            await this.generateTicket(issueUrl, issueTitle, listOfComments)
            this.createTicket()
        }
    }

    // This function is made to parse data from createIfTicketDoesntExist() and return whether ticket already exists. It returns true or false.
    // It exists to prevent duplicate tickets from being created and prevent tickets not being opened if original is closed as Solved
    // and then reopened.
    // Split into a seperate function due to node-zendesks 2.0.0 & 1.5.0 version issues at the time.
    // Use of callbacks like this function and createIfTicketDoesntExist() should only be used until issue is resolved
    // in node-zendesk library.
    public createTicketIfItDoesNotExist(
        body: string | any[],
        ticketExists: boolean,
        issueUrl: string,
        issueTitle: string,
        listOfComments: [listOfCommentsType]
    ) {
        for (let i = 0; i < body.length; i++) {
            if (
                body[i]['external_id'] === issueUrl &&
                body[i]['status'] !== 'solved'
            ) {
                this.ticketCreation(true, issueUrl, issueTitle, listOfComments)
                return true
            }
        }
        this.ticketCreation(false, issueUrl, issueTitle, listOfComments)
        return false
    }
}

export { Ticketmaker }
