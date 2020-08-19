const ZendeskMonitor = require('../lib/zendeskmonitor.js').ZendeskMonitor
const client = require('../__mocks__/client.js')
jest.mock('../__mocks__/client.js')

afterEach(() => {
    jest.clearAllMocks()
})

test('If ticket exists in Zendesk, doesTicketAlreadyExist returns true', async () => {
    let mockTicketData = require('../__mocks__/ticket.json')
    const issueUrl = 'https://github.com/Codertocat/Hello-World/issues/1'
    const newTicket = {
        ticket: {
            subject: 'Test',
            comment: { body: 'Test body' },
            external_id: 'https://github.com/Codertocat/Hello-World/issues/1',
        },
    }
    mockTicketData[0]['external_id'] = issueUrl

    const zendeskMonitor = new ZendeskMonitor(client)
    let ticketExists = zendeskMonitor.doesTicketAlreadyExist()
    expect(ticketExists).toBe(true)

    newTicket['ticket']['external_id'] =
        'https://github.com/Codertocat/Hello-World/issues/2'
    ticketExists = zendeskMonitor.doesTicketAlreadyExist(
        mockTicketData[0],
        newTicket
    )

    expect(ticketExists).toBe(false)
})

test('If ticket does not exist in Zendesk, doesTicketAlreadyExist returns false', async () => {
    const mockTicketData = require('../__mocks__/ticket.json')
    const issueUrl = 'https://github.com/Codertocat/Hello-World/issues/2'
    mockTicketData[0]['external_id'] =
        'https://github.com/Codertocat/Hello-World/issues/1'

    const newTicket = {
        ticket: {
            subject: 'Test',
            comment: { body: 'Test body' },
            external_id: issueUrl,
        },
    }

    const zendeskMonitor = new ZendeskMonitor(client)

    let ticketExists = zendeskMonitor.doesTicketAlreadyExist(
        mockTicketData[0],
        newTicket
    )

    expect(ticketExists).toBe(false)

    mockTicketData[0]['status'] = 'closed'
    ticketExists = zendeskMonitor.doesTicketAlreadyExist(
        mockTicketData[0],
        newTicket
    )
    expect(ticketExists).toBe(false)

    mockTicketData[0]['status'] = 'solved'
    ticketExists = zendeskMonitor.doesTicketAlreadyExist(
        mockTicketData[0],
        newTicket
    )
    expect(ticketExists).toBe(false)
})

test('createTicket() returns true if ticket exists', async () => {
    const mockTicketData = require('../__mocks__/ticket.json')
    mockTicketData[0]['external_id'] =
        'https://github.com/Codertocat/Hello-World/issues/1'
    mockTicketData[0]['status'] = 'open'
    const zendeskMonitor = new ZendeskMonitor(client)

    zendeskMonitor.getAllZendeskTickets = jest
        .fn()
        .mockResolvedValue(mockTicketData)
    let ticketWillNotBeCreated = await zendeskMonitor.createTicketIfItDoesNotExist(
        mockTicketData[0]['status'],
        mockTicketData[0]['external_id'],
        mockTicketData[0]['external_id']
    )

    expect(ticketWillNotBeCreated).toBe(true)
})

test('isTicketOpen() returns true if ticket is open, false if closed', async () => {
    let mockTicketData = require('../__mocks__/ticket.json')
    mockTicketData[0]['external_id'] =
        'https://github.com/Codertocat/Hello-World/issues/1'

    const zendeskMonitor = new ZendeskMonitor(client)
    let status = zendeskMonitor.isTicketOpen(mockTicketData[0]['status'])

    mockTicketData[0]['status'] = 'closed'
    status = zendeskMonitor.isTicketOpen(mockTicketData[0]['status'])
    expect(status).toBe(false)
})

test('addIssueCommentToTicket() updates ticket if ticket doesTicketAlreadyExist returns true', async () => {
    const mockTicketData = require('../__mocks__/ticket.json')
    mockTicketData[0]['external_id'] =
        'https://github.com/Codertocat/Hello-World/issues/1'
    const mockNewTicket = {
        ticket: {
            subject: 'mock ticket',
            external_id: mockTicketData[0]['external_id'],
        },
    }

    const zendeskMonitor = new ZendeskMonitor(client)
    zendeskMonitor.getAllZendeskTickets = jest
        .fn()
        .mockResolvedValue(mockTicketData)
    zendeskMonitor.doesTicketAlreadyExist = jest.fn().mockReturnValue(true)
    let outcome = await zendeskMonitor.updateTicketWithIssueComment(
        mockNewTicket
    )
    expect(outcome).toBe(true)

    zendeskMonitor.doesTicketAlreadyExist = jest.fn().mockReturnValue(false)
    outcome = await zendeskMonitor.updateTicketWithIssueComment(mockNewTicket)
    expect(outcome).toBe(false)
})
