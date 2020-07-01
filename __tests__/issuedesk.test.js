const IssueDesk = require('../lib/issuedesk.js').IssueDesk
const myToken = 'gitHubActionsToken'
const zendeskUsername = 'test@test.com'
const zendeskToken = 'EEEEEeeeeee9eeE9EEeeE99eeEeeee9e99eeEEEe'
const zendeskURI = 'https://test.zendesk.com/api/v2/'

afterEach(() => {
    jest.clearAllMocks()
})

test('monitorIssueAndMakeTicket returns true if getLabelEventData is found in activationLabels', async () => {
    let mockContext = require('../__mocks__/eventIssueComment.json')
    const octokit = require('../__mocks__/octokit.js')
    const IssueMonitor = require('../lib/issuemonitor.js').IssueMonitor
    const TicketMaker = require('../lib/ticketmaker.js').TicketMaker

    jest.mock('@actions/github')
    jest.mock('node-zendesk')
    jest.mock('../__mocks__/octokit.js')
    jest.mock('../lib/issuemonitor.js')
    jest.mock('../lib/ticketmaker.js')

})
