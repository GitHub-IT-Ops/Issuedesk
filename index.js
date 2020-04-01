const github = require('@actions/github');
const core = require('@actions/core');
const myToken = core.getInput('GITHUB_TOKEN');
const zendeskUsername = core.getInput('ZENDESK_USERNAME');
const zendeskToken = core.getInput('ZENDESK_TOKEN');
const zendeskURI = core.getInput('ZENDESK_URI');
const octokit = new github.GitHub(myToken);
const context = github.context;
const Gitzen = require('./lib/gitzen.js').Gitzen
const gitzen = new Gitzen (zendeskUsername, zendeskToken, zendeskURI, context, octokit)


let ticketTitle = context.payload
console.log(context.payload);
console.log("\n");
console.log(context.payload.comment.user.login);
console.log(context.payload.comment.body);
console.log(`To see issue, click [here](${context.payload.issue.url})`);

gitzen.getIssueThread("teakopp", "it-bot", 1)

console.log(commentThread);

