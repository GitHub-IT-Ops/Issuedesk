const core = require("@actions/core");
const myToken = core.getInput("GITHUB_TOKEN");
const zendeskUsername = core.getInput("ZENDESK_USERNAME");
const zendeskToken = core.getInput("ZENDESK_TOKEN");
const zendeskURI = core.getInput("ZENDESK_URI");

const Gitzen = require("./lib/gitzen.js").Gitzen;
const gitzen = new Gitzen(myToken, zendeskUsername, zendeskToken, zendeskURI);

asyncMain();

async function asyncMain() {
  const ticketAlreadyExists = gitzen.doesTicketAlreadyExist();

  if (ticketAlreadyExists) {
    console.log("Ticket already exists! Exiting...");
  } else {
    console.log("This would create a ticket");

    // await gitzen.generateTicket();
    // gitzen.createTicket();
  }
}
