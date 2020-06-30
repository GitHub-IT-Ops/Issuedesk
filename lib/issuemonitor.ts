class IssueMonitor {
    octokit: any
    context: any
    constructor(octokit: any, context: any) {
        this.octokit = octokit
        this.context = context
    }

    private isCorrectLabel(label: string) {
        if (this.context.payload.label.name == label) {
            return true
        } else {
            return false
        }
    }

    private getContext() {
        return this.context
    }

    private getIssueNumber() {
        return this.context.payload.issue.number
    }

    private getRepoOwner() {
        return this.context.payload.repository.owner.login
    }

    private getRepoName() {
        return this.context.payload.repository.name
    }

    private getIssueUrl() {
        return this.context.payload.issue.html_url
    }

    private getLabelEventData() {
        return this.context.payload.label
    }

    private getIssueId() {
        return this.context.payload.issue.id
    }

    public issueWasLabeled() {
        if (this.context.payload.action == 'labeled') {
            return true
        } else {
            return false
        }
    }

    public async getListOfComments() {
        const owner = this.getRepoOwner()
        const repo = this.getRepoName()
        const issue_number = this.getIssueNumber()
        const listOfComments = await this.octokit.issues.listComments({
            owner,
            repo,
            issue_number,
        })

        return listOfComments.data
    }
}

export { IssueMonitor }
