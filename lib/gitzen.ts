const github = require('@actions/github');
var zendesk = require('node-zendesk');

class Gitzen {
    octokit: any;
    context: any;
    zendesk: any;
    client: any;
    constructor( myToken:string, zendeskUsername:string, zendeskToken:string, zendeskURI:string){
        this.octokit = new github.GitHub(myToken);
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

    private isCorrectLabel(label:string){
        if(this.context.payload.label.name == label){
            return true
        }
        else{
            return false
        }
    }

    private doesTicketAlreadyExist(){

    }

    private getIssueNumber(){
       return this.context.payload.issue.number
    }
    

    private getRepoOwner(){
        return this.context.payload.repository
    }
    
    private getRepoName(){
        return this.context.payload.repository.name
    }

    private issueWasLabeled(){
        if (this.context.payload.action == "labeled"){
            return true
        }
        else{
            return false
        }
    }

    private getLabelEventData(){
        return this.context.payload.label 
    }    

    
    public async getIssueThread(){
        let owner = this.getRepoOwner()
        let repo = this.getRepoName()
        let issue_number = this.getIssueNumber()
        let data = await this.octokit.issues.listComments({owner,repo,issue_number});
        return data
    }

    public generateTicket(){

    }

    public createTicket(ticket: object){
        
    }


}

export { Gitzen };