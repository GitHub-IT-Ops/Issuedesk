// Create test for node-zendesk
const IssueDesk = require('../lib/issuedesk.js').IssueDesk
const IssueMonitor = require('../lib/issuemonitor.js').IssueMonitor
const TicketMaker = require('../lib/ticketmaker.js').TicketMaker
const eventIssueLabel = require('../__mocks__/eventIssueLabel.json')


test('monitorIssueAndMakeTicket() returns true if activation label matches event label', async () => {
    const zendesk = require('node-zendesk')
    const github = require('@actions/github')
    jest.mock('@actions/github')
    jest.mock('node-zendesk')
    const issueMonitor = new IssueMonitor(this.octokit, this.context)
    const issuedesk = new IssueDesk(github,'mockZendeskUsername','mockZendeskToken', 'mockZendeskURI')
    issueMonitor.getLabelName.mockReturnValue("bug")

    expect(issuedesk.monitorIssueAndMakeTicket("bug")).toBe(true)
})

