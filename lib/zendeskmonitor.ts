// eslint-disable-next-line no-unused-vars
import { ticketType, listOfCommentsType } from '../types/types.js'

//This class exists to handle all zendesk related events and data. Will eventually split some of ticketmaker.ts into this class once node-zendesk bug is fixed
class ZendeskMonitor {
    client: any
    constructor(client: any) {
        this.client = client
    }

    //Creates ticket in zendesk. Should be called after ticket is generated using generateTicket()
    private createTicket(ticket: ticketType) {
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

    // Makes sure ticket doesn't exist, but will create another ticket if ticket containing same external_id, but has status solved or closed
    // This was done to protect against accidentally closed or solved tickets. Once two way communication is implemented between zendesk and github, this will be immensly important
    private doesTicketAlreadyExist(
        existingTicket: { [x: string]: any },
        newTicket: ticketType
    ) {
        if (
            existingTicket['external_id'] ===
                newTicket['ticket']['external_id'] &&
            existingTicket['status'] !== 'closed' &&
            existingTicket['status'] !== 'solved'
        ) {
            return true
        } else {
            return false
        }
    }

    private async getAllZendeskTickets() {
        return await this.client.tickets.list(
            (err: any, statusList: any, body: [ticketType]) => {
                try {
                    console.log(body)
                    return body
                } catch (err) {
                    console.log(err)
                }
            }
        )
    }

    // Uses callbacks due to node-zendesks 2.0.0 & 1.5.0 version issues at the time.
    // Use of callbacks like this function and createTicketIfItDoesNotExist() should only be used until issue is resolved
    // in node-zendesk library, after that switch it to async/await.
    // Handles entirety of ticket creation process. uses this.client.tickets.list to load all tickets and then runs them through doesTicketAlreadyExist() to make sure duplicate tickets aren't created, if
    // ticket already exist on zendesk. Use this single function to handle all of creation process until bug is solved.
    public async createTicketIfItDoesNotExist(ticket: ticketType) {
        const allZendeskTickets = await this.getAllZendeskTickets()
        console.log(allZendeskTickets)

        for (let i = 0; i < (await allZendeskTickets.length); i++) {
            console.log('loop started')

            const ticketExists = this.doesTicketAlreadyExist(
                allZendeskTickets[i],
                ticket
            )

            if (ticketExists) {
                console.log('Ticket already exists! Exiting...')
                return true
            }
        }
        this.createTicket(ticket)
        return false
    }
}

export { ZendeskMonitor }
