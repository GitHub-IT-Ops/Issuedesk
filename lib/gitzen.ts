const zendesk = require("node-zendesk");
const github = require('@actions/github');


class Gitzen {
    client: any;
    octokit: any;
    context: any;

    contructor(zendeskUsername:string, zendeskToken:string, zendeskURI:string, myToken: string){

        this.client = zendesk.createClient({
            username:  zendeskUsername,
            token:     zendeskToken,
            remoteUri: zendeskURI
          });

          this.octokit = new github.GitHub(myToken);
          this.context = github.context;
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
        console.log(commentThread);
        
    }

    public generateTicket(){

    }

    public createTicket(ticket: object){
        
    }

}

export { Gitzen };