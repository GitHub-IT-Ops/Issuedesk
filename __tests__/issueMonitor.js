// Create test for node-zendesk
const github = require('@actions/github')
const IssueMonitor = require('../lib/issuemonitor.js').IssueMonitor;
const eventIssueComment = require('../__mocks__/eventIssueComment.json'); 
const getIssueComments = require('../__mocks__/getIssueComments.json'); 
jest.mock('@actions/github')
const octokit = github.getOctokit('token')
const issueMonitor = new IssueMonitor(octokit, eventIssueComment)

test('IssueMonitor returns correct context information', () => {
    
    expect(issueMonitor.getIssueNumber()).toBe(1)
    expect(issueMonitor.getRepoOwner()).toBe("Codertocat")
    expect(issueMonitor.getRepoName()).toBe("Hello-World")
    expect(issueMonitor.getIssueUrl()).toBe("https://github.com/Codertocat/Hello-World/issues/1")
    expect(issueMonitor.getIssueId()).toBe(444500041)
    
})


