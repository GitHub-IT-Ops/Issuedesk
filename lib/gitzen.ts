const zendesk = require("node-zendesk");
const github = require('@actions/github');
const core = require('@actions/core');

class Gitzen extends zendesk{
    contructor(zendeskUsername:string, zendeskToken:string, zendeskURI:string, octokit : InstanceType<typeof github>){
        this.client = zendesk.createClient({
            username:  zendeskUsername,
            token:     zendeskToken,
            remoteUri: zendeskURI
          });

        this.octokit = octokit
        this.ticketInfo = {}
    }

    private isCorrectLabel(){

    }

    private doesTicketAlreadyExist(){

    }

    private getIssueNumber(){

    }
    
    private getRepoName(){

    }

    private getIssueLabels(){

    }
    private containsCommand(){

    }
    
    public async getIssueThread(owner: string, repo: string, issue_number: any){
      const commentThread = await this.octokit.issues.listComments({
            owner,
            repo,
            issue_number,
        });

        return commentThread
    }

    public generateTicket(){

    }

    public createTicket(ticket: object){
        
    }

}

export { Gitzen, zendesk};