const core = require('@actions/core')
const myToken = core.getInput('GITHUB_TOKEN')
const zendeskUsername = core.getInput('ZENDESK_USERNAME')
const zendeskToken = core.getInput('ZENDESK_TOKEN')
const zendeskURI = core.getInput('ZENDESK_URI')

const Issuedesk = require('./lib/issuedesk.js').Issuedesk
const issuedesk = new Gitzen(myToken, zendeskUsername, zendeskToken, zendeskURI)

issuedesk.monitorIssueAndMakeTicket()
