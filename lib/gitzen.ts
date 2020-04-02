const zendesk = require("node-zendesk");
const github = require('@actions/github');

class Gitzen {
    client: any;
    octokit: any;
    context: any;
    
    contructor(zendeskUsername:string, zendeskToken:string, zendeskURI:string, myToken:string ,testToken:string){
        console.log(testToken);  
        this.octokit = new github.GitHub(myToken);
        this.context = github.context;
    }
    public logContext(){
        console.log(this.octokit);
        console.log(this.context);
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