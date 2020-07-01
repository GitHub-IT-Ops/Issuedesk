const core = require('@actions/core')
const myToken = core.getInput('GITHUB_TOKEN')
const zendeskUsername = core.getInput('ZENDESK_USERNAME')
const zendeskToken = core.getInput('ZENDESK_TOKEN')
const zendeskURI = core.getInput('ZENDESK_URI')
const activationLabels = core.getInput('ACTIVATION_LABELS')

const IssueDesk = require('./lib/issuedesk.js').IssueDesk
const issuedesk = new IssueDesk(
    myToken,
    zendeskUsername,
    zendeskToken,
    zendeskURI,
    activationLabels
)

issuedesk.monitorIssueAndMakeTicket(activationLabels)
