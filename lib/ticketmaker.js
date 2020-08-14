"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketMaker = void 0;
// class exists to generate and then create ticket in zendesk
// ticket is created and stored in this.ticket so that operations in this class can modify it
var TicketMaker = /** @class */ (function () {
    function TicketMaker() {
        this.ticket = {
            ticket: { comment: { body: '' } },
        };
    }
    TicketMaker.prototype.getTicketBody = function () {
        return this.ticket['ticket']['comment']['body'];
    };
    TicketMaker.prototype.getTicketSubject = function () {
        return this.ticket['ticket']['subject'];
    };
    TicketMaker.prototype.getTicketExternalId = function () {
        return this.ticket['ticket']['external_id'];
    };
    // Currently used to link Zendesk Ticket to github issue by setting external_id to issue's html_url
    // This will be useful when two communication between zendesk and github is enabled
    TicketMaker.prototype.setExternalId = function (externalId) {
        return (this.ticket['ticket']['external_id'] = externalId);
    };
    TicketMaker.prototype.generateTicketComment = function (githubHandle, comment, createdAt) {
        var ticketComments = "Author: " + githubHandle + "\nComment: " + comment + " \n*Created at: " + createdAt + "*\n\n";
        this.ticket['ticket']['comment']['body'] += ticketComments;
        return ticketComments;
    };
    // creates ticket body from info passed to it by github api
    TicketMaker.prototype.generateTicketBody = function (issueBody, githubHandle, timeIssueCreatedAt, issueUrl) {
        var ticketBody = "Issue Created by: " + githubHandle + "\nIssue Content: " + issueBody + " \n*Created at: " + timeIssueCreatedAt + "*\n\n";
        ticketBody += "\n\n\nOriginal issue can be found at " + issueUrl;
        this.ticket['ticket']['comment']['body'] = ticketBody;
        return ticketBody;
    };
    // Sets ticket subject to string, usually set to same name as issue
    TicketMaker.prototype.generateTicketSubject = function (issueTitle) {
        this.ticket['ticket']['subject'] = issueTitle;
        return this.ticket;
    };
    return TicketMaker;
}());
exports.TicketMaker = TicketMaker;
