const core = require('@actions/core')
const myToken = core.getInput('GITHUB_TOKEN')
const zendeskUsername = core.getInput('ZENDESK_USERNAME')
const zendeskToken = core.getInput('ZENDESK_TOKEN')
const zendeskURI = core.getInput('ZENDESK_URI')
const activationLabel = core.getInput('ACTIVATION_LABEL')
const IssueDesk = require('./lib/issuedesk.js').IssueDesk

//Creates instance of issuedesk, which creates instances of other classes to handle operations
const issuedesk = new IssueDesk(
    myToken,
    zendeskUsername,
    zendeskToken,
    zendeskURI,
    activationLabel
)

//Handles "Issue Labeled" events. Passed variable in via Actions variables, because I wanted to make it customizeable for other users. Feel free to pass in more efficent way, if possible.
issuedesk.monitorIssueAndMakeTicket(activationLabel)
