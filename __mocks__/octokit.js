const github = require('@actions/github')
const myToken = 'myToken'
const octokit = new github.getOctokit(myToken)

module.exports = octokit
