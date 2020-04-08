const core = require("@actions/core");
const myToken = core.getInput("GITHUB_TOKEN");
const zendeskUsername = core.getInput("ZENDESK_USERNAME");
const zendeskToken = core.getInput("ZENDESK_TOKEN");
const zendeskURI = core.getInput("ZENDESK_URI");

const Gitzen = require("./lib/gitzen.js").Gitzen;
const gitzen = new Gitzen(myToken, zendeskUsername, zendeskToken, zendeskURI);

console.log(gitzen.getRepoOwner());
console.log(gitzen.getIssueNumber());
console.log(gitzen.getRepoName());
performAsyncTask();

async function performAsyncTask() {
  let issueThread = await gitzen.getListOfComments(); 
  console.log(await gitzen.doesTicketAlreadyExist());
  
}
