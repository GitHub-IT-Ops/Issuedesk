// eslint-disable-next-line no-unused-vars
import { ticketType, listOfCommentsType } from '../types/types.js'

//This class exists to handle all zendesk related events and data. Will eventually split some of ticketmaker.ts into this class once node-zendesk bug is fixed
class ZendeskMonitor {
    client: any
    constructor(client: any) {
        this.client = client
    }

    //Creates ticket in zendesk. Should be called after ticket is generated using generateTicket()
    private createTicket(
        subject: string,
        commentBody: string,
        external_id: string
    ) {
        const ticket = {
            subject: subject,
            comment: { body: commentBody },
            external_id: external_id,
        }
        this.client.tickets.create(
            ticket,
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

    private isTicketOpen(ticketStatus: string) {
        if (ticketStatus !== 'closed' && ticketStatus !== 'solved') {
            return true
        } else {
            return false
        }
    }

    // Makes sure ticket doesn't exist, but will create another ticket if ticket containing same external_id, but has status solved or closed
    // This was done to protect against accidentally closed or solved tickets. Once two way communication is implemented between zendesk and github, this will be immensly important
    private doesTicketAlreadyExist(
        existingTicketStatus: string,
        existingTicketExternalId: string,
        newTicketExternalId: string
    ) {
        const ticketIsOpen = this.isTicketOpen(existingTicketStatus)

        if (existingTicketExternalId === newTicketExternalId && ticketIsOpen) {
            return true
        } else {
            return false
        }
    }

    public async updateTicketWithIssueComment(
        commentBody: string,
        external_id: string
    ) {
        const allZendeskTickets: {
            [x: string]: any
        } = await this.getAllZendeskTickets()

        for (let i = 0; i < allZendeskTickets.length; i++) {
            const ticketExists = this.doesTicketAlreadyExist(
                allZendeskTickets[i]['status'],
                allZendeskTickets[i]['external_id'],
                external_id
            )

            if (ticketExists) {
                const ticket = {
                    ticket: {
                        comment: { body: commentBody },
                    },
                }

                await this.client.tickets.update(
                    allZendeskTickets[i]['id'],
                    ticket
                )
            } else {
                console.log('Ticket does not exist and will not be updated')
            }
        }
    }

    public async getAllZendeskTickets(): Promise<[ticketType]> {
        return await new Promise((resolve) => {
            this.client.tickets.list((err: any, statusList: any, body: any) => {
                try {
                    console.log(body)
                    resolve(body)
                } catch (err) {
                    console.log(err)
                }
            })
        })
    }

    // Uses callbacks due to node-zendesks 2.0.0 & 1.5.0 version issues at the time.
    // Use of callbacks like this function and createTicketIfItDoesNotExist() should only be used until issue is resolved
    // in node-zendesk library, after that switch it to async/await.
    // Handles entirety of ticket creation process. uses this.client.tickets.list to load all tickets and then runs them through doesTicketAlreadyExist() to make sure duplicate tickets aren't created, if
    // ticket already exist on zendesk. Use this single function to handle all of creation process until bug is solved.
    public async createTicketIfItDoesNotExist(
        subject: string,
        commentBody: string,
        external_id: string
    ) {
        const allZendeskTickets: {
            [x: string]: any
        } = await this.getAllZendeskTickets()
        console.log(allZendeskTickets);
        

        for (let i = 0; i < allZendeskTickets.length; i++) {

            const ticketExists = this.doesTicketAlreadyExist(
                allZendeskTickets[i]['status'],
                allZendeskTickets[i]['external_id'],
                external_id
            )

            if (ticketExists) {
                console.log('Ticket already exists! Exiting...')
                return true
            }
        }
        this.createTicket(subject, commentBody, external_id)
        return false
    }
}

export { ZendeskMonitor }
