// eslint-disable-next-line no-unused-vars
import { ticketType, listOfCommentsType } from '../types/types.js'

// class exists to generate and then create ticket in zendesk
// ticket is created and stored in this.ticket so that operations in this class can modify it
class TicketMaker {
    ticket: ticketType
    constructor() {
        this.ticket = {
            ticket: { comment: { body: '' } },
        }
    }

    public getTicketBody() {
        return this.ticket['ticket']['comment']['body']
    }

    public getTicketSubject() {
        return this.ticket['ticket']['subject']
    }

    public getTicketExternalId() {
        return this.ticket['ticket']['external_id']
    }

    // Currently used to link Zendesk Ticket to github issue by setting external_id to issue's html_url
    // This will be useful when two communication between zendesk and github is enabled
    public setExternalId(externalId: string) {
        return (this.ticket['ticket']['external_id'] = externalId)
    }

    public generateTicketComment(
        githubHandle: string,
        comment: string,
        createdAt: string
    ) {
        const ticketComments = `Author: ${githubHandle}\nComment: ${comment} \n*Created at: ${createdAt}*\n\n`
        this.ticket['ticket']['comment']['body'] += ticketComments
        return ticketComments
    }

    // creates ticket body from info passed to it by github api
    public generateTicketBody(
        issueBody: string,
        githubHandle: string,
        timeIssueCreatedAt: string,

        issueUrl: string
    ) {
        let ticketBody = `Issue Created by: ${githubHandle}\nIssue Content: ${issueBody} \n*Created at: ${timeIssueCreatedAt}*\n\n`
        ticketBody += `\n\n\nOriginal issue can be found at ${issueUrl}\n\n`
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
