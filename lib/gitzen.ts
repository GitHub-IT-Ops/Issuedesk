const github = require('@actions/github');
var zendesk = require('node-zendesk');

class Gitzen {
    octokit: any;
    context: any;
    zendesk: any;
    client: any;
    ticket:  { [key: string]: any };
    constructor( myToken:string, zendeskUsername:string, zendeskToken:string, zendeskURI:string){
        this.octokit = new github.GitHub(myToken);
        this.context = github.context;
        this.client = zendesk.createClient({
            username:  zendeskUsername,
            token:     zendeskToken,
            remoteUri: zendeskURI
          });
        this.ticket = {"ticket" : {"subject" : "", "comment" : {"body": "" }, "custom_fields" : []}}
    }

    returnContext () {

        return this.context
    }    

    public async getTicketInfo(ticketID: string){

        let ticket = await this.client.tickets.show(ticketID, (info: any)=>{
            console.log(info);
            
        })

        
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
            
            for (let i=0; i < body.length; i++){
              console.log(body[i].subject);
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

    private getIssueUrl(){
        return this.context.payload.issue.url
    }

    public issueWasLabeled(){
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
        let listOfComments = await this.octokit.issues.listComments({owner,repo,issue_number});
        return listOfComments.data
    }

    
    public async generateTicketBody(){
        let issueThread = await this.getListOfComments()
        let ticketBody = ""
        for (let i=0; i < issueThread.length; i++){
            let commenter = issueThread[i].user.login
            let createdAt = issueThread[i].created_at
            let updatedAt = issueThread[i].updated_at
            let comment = issueThread[i].body
            ticketBody += `Author: ${commenter}\nComment: ${comment} \n*Created at: ${createdAt}*\n\n`
        }
        this.ticket["ticket"]["comment"]["body"] = ticketBody
        return ticketBody
    }

    public createCustomFieldForTicket(){
        let issueId = this.getIssueUrl()
        this.ticket["ticket"]["custom_fields"] = [
            {
              "type": "text",
              "gh_id": issueId
            }
        ]

        return this.ticket

    }

    public generateTicketSubject(){
        let subject = this.getIssueUrl()
        this.ticket["ticket"]["subject"] = this.getIssueUrl()
        return this.ticket
    }
    

    public async generateTicket(){
        this.generateTicketSubject()
        await this.generateTicketBody()
        this.createCustomFieldForTicket()
    }

    public createTicket(){
        console.log(this.ticket);
        
        this.client.tickets.create( this.ticket,  (err: any, req: any, result: any) => {
            if (err) return handleError(err);
            console.log(JSON.stringify(result, null, 2));
            console.log("Ticket created!");
          });
          
          function handleError(err: any) {
              console.log(err);
              process.exit(-1);
          }
    }


}

export { Gitzen };