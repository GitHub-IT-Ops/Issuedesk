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
    expect(issueMonitor.getLabelName()).toBe(":bug: Bugfix")
})

test('getIssueBody() returns issue body from context', () => {
    expect(issueMonitor.getIssueBody()).toBe("It looks like you accidently spelled 'commit' with two 't's.")
})


test('getTimeIssueCreatedAt() returns issue created_at for issue from context', () => {
    expect(issueMonitor.getTimeIssueCreatedAt()).toBe("2019-05-15T15:20:18Z")
})

