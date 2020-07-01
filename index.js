const core = require('@actions/core')
const myToken = core.getInput('GITHUB_TOKEN')
const zendeskUsername = core.getInput('ZENDESK_USERNAME')
const zendeskToken = core.getInput('ZENDESK_TOKEN')
const zendeskURI = core.getInput('ZENDESK_URI')
const activationLabel = core.getInput('ACTIVATION_LABEL')
const settings = require('./settings/settings.json')


const IssueDesk = require('./lib/issuedesk.js').IssueDesk
const issuedesk = new IssueDesk(
    myToken,
    zendeskUsername,
    zendeskToken,
    zendeskURI,
    activationLabels
)

issuedesk.monitorIssueAndMakeTicket(activationLabel)
