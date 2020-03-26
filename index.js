const github = require('@actions/github');
const core = require('@actions/core');
const myToken = core.getInput('GITHUB_TOKEN');
const octokit = new github.GitHub(myToken);
const context = github.context;

console.log(context.payload.comment.user.login);
console.log(context.payload.comment.body);

