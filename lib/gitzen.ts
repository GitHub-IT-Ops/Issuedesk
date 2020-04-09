const github = require('@actions/github');
var zendesk = require('node-zendesk');

class Gitzen {
    octokit: any;
    context: any;
    zendesk: any;
    client: any;
    ticket: object;
    constructor( myToken:string, zendeskUsername:string, zendeskToken:string, zendeskURI:string){
        this.octokit = new github.GitHub(myToken);
        this.context = github.context;
        this.client = zendesk.createClient({
            username:  zendeskUsername,
            token:     zendeskToken,
            remoteUri: zendeskURI
          });
        this.ticket = {}
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

    public doesTicketAlreadyExist(){
        this.client.tickets.list((err: any, statusList: any, body: any, responseList: any, resultList: any) => {
            if (err) {
              console.log(err);
              return;
            }
            
            let formattedJSON = JSON.stringify(body, null, 2)
            console.log(formattedJSON);
            console.log("-----");
        
            for (let i=0; i < formattedJSON.length; i++){
              console.log(resultList[i]);
            }

          });


    }

    private getIssueNumber(){
       return this.context.payload.issue.number
    }
    

    private getRepoOwner(){
        return this.context.payload.repository.owner.login
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

    
    public async getListOfComments(){
        let owner = this.getRepoOwner()
        let repo = this.getRepoName()
        let issue_number = this.getIssueNumber()
        return await this.octokit.issues.listComments({owner,repo,issue_number});
    }

    
    public async formatListComments(listOfComments:[]){
        let issueThread = await this.getListOfComments()
        for (let i=0; i < issueThread.length; i++){
            let commenter = issueThread[i].user.login
            let createdAt = issueThread[i].created_at
            let updatedAt = issueThread[i].updated_at
            let comment = issueThread[i].body
            console.log(commenter, createdAt, updatedAt, comment);
            
        }
    }

    public generateTicket(){

    }

    public createTicket(ticket: object){
        
    }


}

export { Gitzen };