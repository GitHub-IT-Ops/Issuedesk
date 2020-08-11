// eslint-disable-next-line no-unused-vars
import { ticketType, listOfCommentsType } from '../types/types.js'

// class exists to generate and then create ticket in zendesk
// ticket is created and stored in this.ticket so that operations in this class can modify it
class TicketMaker {
    ticket: ticketType
    constructor() {
        this.ticket = {
            ticket: { comment: { body: '' }, external_id: '' },
        }
    }

    public getTicket() {
        return this.ticket
    }

    //currently used to link Zendesk Ticket to github issue by setting external_id to issue's html_url
    // This will be useful when two communication between zendesk and github is enabled
    public setExternalId(externalId: string) {
        return (this.ticket['ticket']['external_id'] = externalId)
    }

    // creates ticket body from info passed to it by github api
    public generateTicketBody(
        issueBody: string,
        issueAuthor: string,
        timeIssueCreatedAt: string,
        listOfComments: [listOfCommentsType],
        issueUrl: string
    ) {
        let ticketBody = `Issue Created by: ${issueAuthor}\nIssue Content: ${issueBody} \n*Created at: ${timeIssueCreatedAt}*\n\n`

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
}

export { TicketMaker }
