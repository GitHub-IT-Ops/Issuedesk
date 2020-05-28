require("dotenv").config();
var zendesk = require("node-zendesk");
const zendeskUsername = process.env.USERNAME;
const zendeskToken = process.env.ZENDESK_TOKEN;
const zendeskURI = process.env.URI;

console.log(zendeskUsername);

const client = zendesk.createClient({
  username: zendeskUsername,
  token: zendeskToken,
  remoteUri: zendeskURI
});

async function getTicketInfo(ticketID) {
  await client.ticket.show(ticketID, data => {
    console.log(data);
  });
}

getTicketInfo();
