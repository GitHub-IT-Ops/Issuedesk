const github = require('@actions/github');
var zendesk = require('node-zendesk');

class Gitzen {
    token: string | undefined;
    github: any;
    context: object;
    zendesk: any;
    client: any;
    constructor( myToken:string,zendeskUsername:string, zendeskToken:string, zendeskURI:string){
        this.token = myToken
        this.github = new github.GitHub(this.token);
        this.context = github.context;
        this.client = zendesk.createClient({
            username:  process.env.USERNAME,
            token:     process.env.ZENDESK_TOKEN,
            remoteUri: process.env.URI
          });
    }

    returnContext () {

        return this.context
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