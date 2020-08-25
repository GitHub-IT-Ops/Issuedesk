// Create test for node-zendesk
const IssueMonitor = require('../lib/issuemonitor.js').IssueMonitor
const eventIssueLabel = require('../__mocks__/eventIssueLabel.json')
const octokit = require('../__mocks__/octokit.js')
jest.mock('../__mocks__/octokit.js')

const issueMonitor = new IssueMonitor(octokit, eventIssueLabel)

test('context value is not undefined and is initalized with context data', async () => {
    expect(issueMonitor.getContext()).toBe(eventIssueLabel)
    expect(issueMonitor.getContext()).toBeDefined()
})

test('IssueMonitor returns correct issue number in context', () => {
    expect(issueMonitor.getIssueNumber()).toBe(1)
})

test('IssueMonitor returns correct repo owner in context', () => {
    expect(issueMonitor.getRepoOwner()).toBe('Codertocat')
})

test('IssueMonitor returns correct repo name in context', () => {
    expect(issueMonitor.getRepoName()).toBe('Hello-World')
})

test('IssueMonitor returns correct issue url in context', () => {
    expect(issueMonitor.getIssueUrl()).toBe(
        'https://github.com/Codertocat/Hello-World/issues/1'
    )
})

test('IssueMonitor returns correct issue ID in context', () => {
    expect(issueMonitor.getIssueId()).toBe(444500041)
})

test('getLabelName returns correct label name in context', () => {
    expect(issueMonitor.getLabelName()).toBe(':bug: Bugfix')
})

test('getIssueBody() returns issue body from context', () => {
    expect(issueMonitor.getIssueBody()).toBe(
        "It looks like you accidently spelled 'commit' with two 't's."
    )
})

test('getTimeIssueCreatedAt() returns issue created_at for issue from context', () => {
    expect(issueMonitor.getTimeIssueCreatedAt()).toBe('2019-05-15T15:20:18Z')
})

test('getEventAction returns action info from context', () => {
    expect(issueMonitor.getEventAction()).toBe('labeled')
})

test('ticketHasActivationLabel returns issue label data', () => {
    const labels = issueMonitor.getIssueLabels()
    expect(labels[0]['name']).toBe('bug')
})

test('getIssueComment returns single issue comment on issue comment event', () => {
    jest.clearAllMocks()
    const eventIssueLabel = require('../__mocks__/eventIssueComment.json')
    const issueMonitor = new IssueMonitor(octokit, eventIssueLabel)
    const comment = issueMonitor.getIssueComment()
    expect(comment).toBe(
        "You are totally right! I'll get this fixed right away."
    )
})

test('ticketHasActivationLabel returns issue label data', () => {
    jest.clearAllMocks()
    const eventIssueLabel = require('../__mocks__/eventIssueComment.json')
    const issueMonitor = new IssueMonitor(octokit, eventIssueLabel)
    const time = issueMonitor.getCommentCreatedAtTime()
    expect(time).toBe('2019-05-15T15:20:21Z')
})

test('getCommentAuthor returns comment author github handle', () => {
    jest.clearAllMocks()
    const eventIssueLabel = require('../__mocks__/eventIssueComment.json')
    const issueMonitor = new IssueMonitor(octokit, eventIssueLabel)
    const commentAuthor = issueMonitor.getCommentAuthor()
    expect(commentAuthor).toBe("Codertocat")
})


