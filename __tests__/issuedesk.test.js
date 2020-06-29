const IssueDesk = require('../lib/issuedesk.js').IssueDesk
const IssueMonitor = require('../lib/issuemonitor.js').IssueMonitor
const TicketMaker = require('../lib/ticketmaker.js').TicketMaker
const mockContext = require('../__mocks__/eventIssueComment.json')
const mockListOfComments = require('../__mocks__/getIssueComments.json')
const myToken = 'gitHubActionsToken'
const zendeskUsername = 'test@test.com'
const zendeskToken = "EEEEEeeeeee9eeE9EEeeE99eeEeeee9e99eeEEEe"
const zendeskURI = 'https://test.zendesk.com/api/v2/'
jest.mock('../lib/issuemonitor.js')
jest.mock('../lib/ticketmaker.js')


afterEach(() => {
    jest.clearAllMocks()
})

test("IssueMonitor & TicketMaker are both instantiated in monitorIssueAndMakeTicket()", async () => {
    const mockIssuedesk = new IssueDesk(myToken, zendeskUsername, zendeskToken, zendeskURI)

    await mockIssuedesk.monitorIssueAndMakeTicket() 
    expect(IssueMonitor).toHaveBeenCalled();
    expect(TicketMaker).toHaveBeenCalled();

})


