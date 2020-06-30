// Create test for node-zendesk
const IssueMonitor = require('../lib/issuemonitor.js').IssueMonitor
const eventIssueComment = require('../__mocks__/eventIssueComment.json')
const getIssueComments = require('../__mocks__/getIssueComments.json')
const octokit = require('../__mocks__/octokit.js')
jest.mock('../__mocks__/octokit.js')
const issueMonitor = new IssueMonitor(octokit, eventIssueComment)

test('context value is not undefined and is initalized with context data', async () => {

    expect(issueMonitor.getContext()).toBe(eventIssueComment)
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

test('', () => {
    expect(issueMonitor.getIssueTitle()).toBe("Spelling error in the README file")
})