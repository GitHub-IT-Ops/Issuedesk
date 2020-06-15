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

function doesTicketAlreadyExist() {
  client.tickets.list((err, statusList, body) => {
    if (err) {
      console.log(err);
      return;
    }

    for (let i = 0; i < body.length; i++) {
      console.log(
        body[i]["external_id"] ===
          "https://api.github.com/repos/teakopp/it-bot/issues/1"
      );
    }
  });
}

doesTicketAlreadyExist();
