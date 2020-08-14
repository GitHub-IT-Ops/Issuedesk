const TicketMaker = require('../lib/ticketmaker.js').TicketMaker
const client = require('../__mocks__/client.js')
jest.mock('../__mocks__/client.js')

afterEach(() => {
    jest.clearAllMocks()
})

test('Ticket body is generated with correct info and in proper format', async () => {
    const ticketMaker = new TicketMaker(client)
    const issueBody = 'Me too'
    const issueAuthor = 'octocat'
    const timeIssueCreatedAt = '2011-04-14T16:00:49Z'
    const expectedTicketBody =
        'Issue Created by: octocat\n' +
        'Issue Content: Me too \n' +
        '*Created at: 2011-04-14T16:00:49Z*\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        'Original issue can be found at https://github.com/Codertocat/Hello-World/issues/1'

    const issueURL = 'https://github.com/Codertocat/Hello-World/issues/1'
    ticketMaker.generateTicketBody(
        issueBody,
        issueAuthor,
        timeIssueCreatedAt,
        issueURL
    )

    expect(ticketMaker.getTicketBody()).toBe(expectedTicketBody)
})

test('Ticket Comment is generated with correct info and in proper format', async () => {
    const ticketMaker = new TicketMaker(client)
    const comment = 'test'
    const githubHandle = 'mona'
    const createdAt = '2011-04-14T16:00:49Z'
    ticketMaker.generateTicketComment(
        githubHandle,
        comment,
        createdAt
    ) 
        const expectedTicketComments = `Author: ${githubHandle}\nComment: ${comment} \n*Created at: ${createdAt}*\n\n`
        expect(ticketMaker.getTicketComments()).toBe(expectedTicketComments)
})

test('generateTicketSubject() creates title in correct location for ticket', async () => {
    const ticketMaker = new TicketMaker(client)
    ticketMaker.generateTicketSubject('Spelling error in the README file')
    const ticketInfo = ticketMaker.getTicket()
    expect(ticketInfo.ticket.subject).toBe('Spelling error in the README file')
})
