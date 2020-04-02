const zendesk = require("node-zendesk");
const github = require('@actions/github');
const core = require('@actions/core');
const myToken = core.getInput('GITHUB_TOKEN');

class Gitzen {
    client: any;
    octokit: any;
    context: any;
    
    contructor(zendeskUsername:string, zendeskToken:string, zendeskURI:string, myToken:string){
        console.log("hello");  
        console.log(myToken);
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