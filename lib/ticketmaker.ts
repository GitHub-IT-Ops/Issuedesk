// eslint-disable-next-line no-unused-vars
import { ticketType, listOfCommentsType } from '../types/types.js'

// class exists to generate and then create ticket in zendesk 
// ticket is created and stored in this.ticket so that operations in this class can modify it
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

    //currently used to link Zendesk Ticket to github issue by setting external_id to issue's html_url
    // This will be useful when two communication between zendesk and github is enabled
    private setExternalId(externalId: string) {
        return (this.ticket['ticket']['external_id'] = externalId)
    }

    // creates ticket body from info passed to it by github api
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

    // Sets ticket subject to string, usually set to same name as issue
    public generateTicketSubject(issueTitle: string) {
        this.ticket['ticket']['subject'] = issueTitle
        return this.ticket
    }

    // Generates ticket in this.ticket using arguments passed in.
    // Ticket is ready to be sent to zendesk after this is called
    public async generateTicket(
        issueUrl: string,
        issueTitle: string,
        listOfComments: [listOfCommentsType]
    ) {
        this.setExternalId(issueUrl)
        this.generateTicketSubject(issueTitle)
        await this.generateTicketBody(listOfComments, issueUrl)
    }

    //Creates ticket in zendesk. Should be called after ticket is generated using generateTicket()
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
    // This function exists soley to complete the creation process by nesting inside createTicketIfItDoesNotExist(). Remove as soon as possible in favor of async / await
    // Handles entirety of ticket creation process, by generating ticket using passed in args and then calling createTicket() to actually create it in zendesk
    private async ticketCreation(
        issueUrl: string,
        issueTitle: string,
        listOfComments: [listOfCommentsType]
    ) {
        await this.generateTicket(issueUrl, issueTitle, listOfComments)
        this.createTicket()
    }

    // Makes sure ticket doesn't exist, but will create another ticket if ticket containing same external_id, but has status solved or closed
    // This was done to protect against accidentally closed or solved tickets. Once two way communication is implemented between zendesk and github, this will be immensly important
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
    // Handles entirety of ticket creation process. uses this.client.tickets.list to load all tickets and then runs them through doesTicketAlreadyExist() to make sure duplicate tickets aren't created, if
    // ticket already exist on zendesk. Use this single function to handle all of creation process until bug is solved.

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
