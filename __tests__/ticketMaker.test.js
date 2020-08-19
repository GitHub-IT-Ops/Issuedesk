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
    const issueUrl = 'https://github.com/Codertocat/Hello-World/issues/1'
    let expectedTicketBody = `Issue Created by: ${issueAuthor}\nIssue Content: ${issueBody} \n*Created at: ${timeIssueCreatedAt}*\n\n\n`
    expectedTicketBody += `Original issue can be found at ${issueUrl}\n\n\n`
    ticketMaker.generateTicketBody(
        issueBody,
        issueAuthor,
        timeIssueCreatedAt,
        issueUrl
    )

    expect(ticketMaker.getTicketBody()).toBe(expectedTicketBody)
})

test('Ticket Comment is generated with correct info and in proper format', async () => {
    const ticketMaker = new TicketMaker(client)
    const comment = 'test'
    const githubHandle = 'mona'
    const createdAt = '2011-04-14T16:00:49Z'
    ticketMaker.generateTicketComment(githubHandle, comment, createdAt)
    const expectedTicketComments = `\n\nAuthor: ${githubHandle}\nComment: ${comment} \n*Created at: ${createdAt}*\n\n`
    expect(ticketMaker.getTicketBody()).toBe(expectedTicketComments)
})

test('generateTicketSubject() creates title in correct location for ticket', async () => {
    const ticketMaker = new TicketMaker(client)
    ticketMaker.generateTicketSubject('Spelling error in the README file')
    expect(ticketMaker.getTicketSubject()).toBe(
        'Spelling error in the README file'
    )
})
