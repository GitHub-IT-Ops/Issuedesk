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
    const ticketExists = zendeskMonitor.doesTicketAlreadyExist(
        mockTicketData[0],
        newTicket
    )
    expect(ticketExists).toBe(true)
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

test("createTicket() is called once if ticket doesn't exist", async () => {
    const mockTicketData = require('../__mocks__/ticket.json')
    mockTicketData[0]['external_id'] =
        'https://github.com/Codertocat/Hello-World/issues/1'

    const zendeskMonitor = new ZendeskMonitor(client)
    zendeskMonitor.createTicketIfItDoesNotExist(
        mockTicketData
    )
    expect(client.tickets.list.mock.calls.length).toBe(1)
})

