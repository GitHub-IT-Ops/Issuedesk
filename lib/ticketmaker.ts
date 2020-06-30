import { ticketType, listOfCommentsType } from '../types/types.js'

class TicketMaker {
    client: any
    ticket: ticketType
    constructor(client: any) {
        this.client = client
        this.ticket = {
            ticket: { subject: '', comment: { body: '' }, external_id: '' },
        }
    }

    public getCurrentTicketInfo() {
        return this.ticket
    }

    private setExternalId(externalId: string) {
        return (this.ticket['ticket']['external_id'] = externalId)
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
        issueUrl: string,
        issueTitle: string,
        listOfComments: [listOfCommentsType]
    ) {
        await this.generateTicket(issueUrl, issueTitle, listOfComments)
        this.createTicket()
    }

    private doesTicketAlreadyExist(
        ticket: { [x: string]: any },
        issueUrl: string
    ) {
        if (
            ticket['external_id'] === issueUrl &&
            ticket['status'] !== 'closed' &&
            ticket['status'] !== 'solved'
        ) {
            return true
        } else {
            return false
        }
    }

    // This exists to prevent duplicate tickets from being created and prevent tickets not being opened if original is closed as Solved
    // and then reopened.
    // Split into a seperate function due to node-zendesks 2.0.0 & 1.5.0 version issues at the time.
    // Use of callbacks like this function and createTicketIfItDoesNotExist() should only be used until issue is resolved
    // in node-zendesk library.

    public createTicketIfItDoesNotExist(
        issueUrl: string,
        issueTitle: string,
        listOfComments: [listOfCommentsType]
    ) {
        this.client.tickets.list((err: any, statusList: any, body: any) => {
            for (let i = 0; i < body.length; i++) {
                const ticketExists = this.doesTicketAlreadyExist(
                    body[i],
                    issueUrl
                )

                if (ticketExists) {
                    console.log('Ticket already exists! Exiting...')
                    return true
                }
            }
            this.ticketCreation(issueUrl, issueTitle, listOfComments)
            return false
        })
    }
}

export { TicketMaker }
