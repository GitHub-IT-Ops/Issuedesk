const IssueDesk = require('../lib/issuedesk.js').IssueDesk
const IssueMonitor = require('../lib/issuemonitor.js').IssueMonitor
const TicketMaker = require('../lib/ticketmaker.js').TicketMaker
const myToken = 'gitHubActionsToken'
const zendeskUsername = 'test@test.com'
const zendeskToken = 'EEEEEeeeeee9eeE9EEeeE99eeEeeee9e99eeEEEe'
const zendeskURI = 'https://test.zendesk.com/api/v2/'
jest.mock('../lib/issuemonitor.js')
jest.mock('../lib/ticketmaker.js')
jest.mock('@actions/github')
jest.mock('node-zendesk')
jest.mock('../__mocks__/octokit.js')

afterEach(() => {
    jest.clearAllMocks()
})

test('IssueMonitor & TicketMaker are both instantiated in monitorIssueAndMakeTicket() and all function inputs are correct', async () => {
    let mockContext = require('../__mocks__/eventIssueComment.json')
    let mockListOfComment = require('../__mocks__/getIssueComments.json')
    
    const mockIssuedesk = new IssueDesk(
        myToken,
        zendeskUsername,
        zendeskToken,
        zendeskURI
    )

    await mockIssuedesk.monitorIssueAndMakeTicket()

    const mockCreateTicketIfItDoesNotExist = TicketMaker.mock.instances[0].createTicketIfItDoesNotExist
    expect(mockCreateTicketIfItDoesNotExist).toHaveBeenCalledWith(undefined, undefined, undefined)
  
    expect(IssueMonitor).toHaveBeenCalled()
    expect(TicketMaker).toHaveBeenCalled()

})

