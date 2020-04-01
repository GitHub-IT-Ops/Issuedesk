const zendesk = require("node-zendesk");
const github = require('@actions/github');
const core = require('@actions/core');

class Gitzen extends zendesk{
    contructor(username:string, token:string, remoteUri:string, octokit : InstanceType<typeof github>, context: object){
        this.client = zendesk.createClient({
            username:  process.env.USERNAME,
            token:     process.env.ZENDESK_TOKEN,
            remoteUri: process.env.URI
          });

        this.context = context
        this.octokit = octokit
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

    }

    public generateTicket(){

    }

    public createTicket(ticket: object){
        
    }





}