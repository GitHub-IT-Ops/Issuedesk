const TicketMaker = require('../lib/ticketmaker.js').TicketMaker
const client = require('../__mocks__/client.js')
jest.mock('../__mocks__/client.js')

afterEach(() => {
    jest.clearAllMocks()
})

test('Ticket body is generated with correct info and in proper format', async () => {
    const ticketMaker = new TicketMaker(client)
    let mockIssueCommentsData = require('../__mocks__/getIssueComments.json')
    const issueBody = 'test'
    const issueAuthor = 'mona'
    const timeIssueCreatedAt = '2011-04-14T16:00:49Z'
    const expectedTicketBody =
        `Issue Created by: ${issueAuthor}\nIssue Content: ${issueBody} \n*Created at: ${timeIssueCreatedAt}*\n\n` +
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
    const ticketBody = ticketMaker.generateTicketBody(
        issueBody,
        issueAuthor,
        timeIssueCreatedAt,
        listOfComments,
        issueURL
    )

    expect(ticketBody).toBe(expectedTicketBody)
})


test('generateTicketSubject() creates title in correct location for ticket', async () => {
    const ticketMaker = new TicketMaker(client)
    ticketMaker.generateTicketSubject('Spelling error in the README file')
    const ticketInfo = ticketMaker.getTicket()
    expect(ticketInfo.ticket.subject).toBe('Spelling error in the README file')
})
