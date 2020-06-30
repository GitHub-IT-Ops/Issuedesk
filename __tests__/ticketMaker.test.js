const TicketMaker = require('../lib/ticketmaker.js').TicketMaker
const client = require('../__mocks__/client.js')
const { IssueMonitor } = require('../lib/issuemonitor.js')
jest.mock('../__mocks__/client.js')

afterEach(() => {
    jest.clearAllMocks()
})

test('Ticket body is generated with correct info and in proper format', async () => {
    const ticketMaker = new TicketMaker(client)
    let mockIssueCommentsData = require('../__mocks__/getIssueComments.json')
    const expectedTicketBody =
    'Author: octocat\n' +
        'Comment: Me too \n' +
        '*Created at: 2011-04-14T16:00:49Z*\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        'Original issue can be found at https://github.com/Codertocat/Hello-World/issues/1'

    const listOfComments = mockIssueCommentsData
    const issueURL = 'https://github.com/Codertocat/Hello-World/issues/1'
    const ticketBody = await ticketMaker.generateTicketBody(
        listOfComments,
        issueURL
    )

    expect(ticketBody).toBe(expectedTicketBody)
})

test('If ticket exists in Zendesk, it will not be created by TicketMaker', async () => {
    let mockTicketData = require('../__mocks__/ticket.json')
    const mockIssueCommentsData = require('../__mocks__/getIssueComments.json')
    const issueUrl = 'https://github.com/Codertocat/Hello-World/issues/1'
    mockTicketData[0]['external_id'] = issueUrl
    const ticketMaker = new TicketMaker(client)
    const ticketExists = ticketMaker.doesTicketAlreadyExist(
        mockTicketData[0],
        issueUrl,
        'Test Title',
        mockIssueCommentsData
    )
    expect(ticketExists).toBe(true)
})

test('If ticket does not exist in Zendesk, it will be created by TicketMaker', async () => {
    const mockTicketData = require('../__mocks__/ticket.json')
    const issueUrl = 'https://github.com/Codertocat/Hello-World/issues/2'
    mockTicketData[0]['external_id'] =
        'https://github.com/Codertocat/Hello-World/issues/1'
    const mockIssueCommentsData = require('../__mocks__/getIssueComments.json')
    const ticketMaker = new TicketMaker(client)
    const ticketExists = ticketMaker.doesTicketAlreadyExist(
        mockTicketData[0],
        issueUrl,
        'Test Title',
        mockIssueCommentsData
    )
    expect(ticketExists).toBe(false)
})

test("ticketCreation() is called once if ticket doesn't exist", async () => {
    const mockIssueCommentsData = require('../__mocks__/getIssueComments.json')
    const mockTicketData = require('../__mocks__/ticket.json')
    const issueUrl = 'https://github.com/Codertocat/Hello-World/issues/2'
    mockTicketData[0]['external_id'] =
        'https://github.com/Codertocat/Hello-World/issues/1'

    const ticketMaker = new TicketMaker(client)
    ticketMaker.createTicketIfItDoesNotExist(
        mockTicketData,
        issueUrl,
        'Test Title',
        mockIssueCommentsData
    )
    expect(client.tickets.list.mock.calls.length).toBe(1)
})
