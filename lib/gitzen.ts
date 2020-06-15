const github = require("@actions/github");
const zendesk = require("node-zendesk");

interface ticket {
  ticket: {
    subject: string;
    comment: { body: string };
    external_id: string;
  };
}

class Gitzen {
  octokit: any;
  context: any;
  zendesk: any;
  client: any;
  ticket: ticket;
  constructor(
    myToken: string,
    zendeskUsername: string,
    zendeskToken: string,
    zendeskURI: string
  ) {
    this.octokit = new github.GitHub(myToken);
    this.context = github.context;
    this.client = zendesk.createClient({
      username: zendeskUsername,
      token: zendeskToken,
      remoteUri: zendeskURI
    });
    this.ticket = {
      ticket: { subject: "", comment: { body: "" }, external_id: "" }
    };
  }

  returnContext() {
    return this.context;
  }

  public getTicketInfo(ticketID: string) {
    this.client.ticket.show(ticketID, (data: any) => {
      console.log(data);
    });
  }

  private isCorrectLabel(label: string) {
    if (this.context.payload.label.name == label) {
      return true;
    } else {
      return false;
    }
  }

  private setExternalId(externalId: string) {
    return (this.ticket["ticket"]["external_id"] = externalId);
  }

  public doesTicketAlreadyExist() {
    this.client.tickets.list((err: any, statusList: any, body: any) => {
      if (err) {
        console.log(err);
        return;
      }

      for (let i = 0; i < body.length; i++) {
        const issueUrl = this.getIssueUrl();
        const ticketExists = body[i]["external_id"] === issueUrl;
        console.log(body[i]["external_id"] === issueUrl);
        return ticketExists;
      }
    });
  }

  private getIssueNumber() {
    return this.context.payload.issue.number;
  }

  private getRepoOwner() {
    return this.context.payload.repository.owner.login;
  }

  private getRepoName() {
    return this.context.payload.repository.name;
  }

  private getIssueUrl() {
    return this.context.payload.issue.url;
  }

  private getLabelEventData() {
    return this.context.payload.label;
  }

  private getIssueId() {
    return this.context.payload.label;
  }

  public issueWasLabeled() {
    if (this.context.payload.action == "labeled") {
      return true;
    } else {
      return false;
    }
  }

  public async getListOfComments() {
    const owner = this.getRepoOwner();
    const repo = this.getRepoName();
    const issue_number = this.getIssueNumber();
    const listOfComments = await this.octokit.issues.listComments({
      owner,
      repo,
      issue_number
    });
    return listOfComments.data;
  }

  public async generateTicketBody() {
    const issueThread = await this.getListOfComments();
    let ticketBody = "";
    for (let i = 0; i < issueThread.length; i++) {
      const commenter = issueThread[i].user.login;
      const createdAt = issueThread[i].created_at;
      const comment = issueThread[i].body;
      ticketBody += `Author: ${commenter}\n\nComment: ${comment} \n\n*Created at: ${createdAt}*\n\n\n\n`;
    }
    this.ticket["ticket"]["comment"]["body"] = ticketBody;
    return ticketBody;
  }

  public generateTicketSubject() {
    this.ticket["ticket"]["subject"] = this.getIssueUrl();
    return this.ticket;
  }

  public async generateTicket() {
    this.setExternalId(this.getIssueUrl());
    this.generateTicketSubject();
    await this.generateTicketBody();
  }

  public createTicket() {
    console.log(this.ticket);

    this.client.tickets.create(
      this.ticket,
      (err: any, req: any, result: any) => {
        if (err) return handleError(err);
        console.log(JSON.stringify(result, null, 2));
        console.log("Ticket created!");
      }
    );

    function handleError(err: any) {
      console.log(err);
      process.exit(-1);
    }
  }
}

export { Gitzen };
