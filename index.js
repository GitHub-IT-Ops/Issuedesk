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

const eventAction = issuedesk.getIssueAction()

switch (eventAction) {
    case 'labeled':
        issuedesk.monitorIssueAndMakeTicket(activationLabel)
        break
    case 'issue_comment':
        issuedesk.updateTicketWithComment(activationLabel)
}
