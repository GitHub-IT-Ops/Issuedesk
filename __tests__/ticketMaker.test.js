const TicketMaker = require('../lib/ticketmaker.js').TicketMaker
const eventIssueComment = require('../__mocks__/eventIssueComment.json')
const getIssueComments = require('../__mocks__/getIssueComments.json')
const client = require('../__mocks__/client.js')
jest.mock('../__mocks__/client.js')
const ticketMaker = new TicketMaker(client)

test('Ticket body is generated with correct info and in proper format', async () => {
    const expectedTicketBody =
        'Author: octocat\n' +
        'Comment: Me too \n' +
        '*Created at: 2011-04-14T16:00:49Z*\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        'Original issue can be found at https://github.com/Codertocat/Hello-World/issues/1'

    const listOfComments = getIssueComments
    const issueURL = 'https://github.com/Codertocat/Hello-World/issues/1'
    const ticketBody = await ticketMaker.generateTicketBody(
        listOfComments,
        issueURL
    )

    expect(ticketBody).toBe(expectedTicketBody)
})

test('Ticket is created if it does not already exist', async() => {
    const issueURL = 'https://github.com/Codertocat/Hello-World/issues/1'
    const listOfComments = 'Test List'
    ticketMaker.createTicketIfItDoesNotExist('Test Body', issueURL, 'Test Title')
})
