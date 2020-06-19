"use strict";
var github = require('@actions/github');
var zendesk = require('node-zendesk');
var IssueMonitor = require('issuemonitor.js');
var TicketMaker = require('ticketmaker.js');
var ZendeskMonitor = require('zendeskmonitor.js');
var ZendeskUpdater = require('zendeskupdater.js');
var Issuedesk = /** @class */ (function () {
    function Issuedesk(myToken, zendeskUsername, zendeskToken, zendeskURI) {
        this.octokit = github.getOctokit(myToken);
        this.context = github.context;
        this.client = zendesk.createClient({
            username: zendeskUsername,
            token: zendeskToken,
            remoteUri: zendeskURI,
        });
        this.ticket = {
            ticket: { subject: '', comment: { body: '' }, external_id: '' },
        };
    }
    return Issuedesk;
}());
