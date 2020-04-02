const zendesk = require("node-zendesk");
const github = require('@actions/github');
const core = require('@actions/core');

class Gitzen extends zendesk{
    contructor(zendeskUsername:string, zendeskToken:string, zendeskURI:string){
        this.client = zendesk.createClient({
            username:  zendeskUsername,
            token:     zendeskToken,
            remoteUri: zendeskURI
          });

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
        console.log("ok");
        
    }

    public generateTicket(){

    }

    public createTicket(ticket: object){
        
    }

}

export { Gitzen };