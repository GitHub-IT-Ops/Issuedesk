
class Gitzen {
    username: string | undefined;
    
    contructor(zendeskUsername:string, zendeskToken:string, zendeskURI:string){
        this.username = zendeskUsername;
    }

    logUsername = () => {
        return this.username;
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