//This class exists to handle all github related events and data. Most of the function names explain their purpose and just pull and return info from this.context
class IssueMonitor {
    octokit: any
    context: any
    constructor(octokit: any, context: any) {
        this.octokit = octokit
        this.context = context
    }

    // exists soley for test function check
    private getContext() {
        return this.context
    }

    public isCorrectLabel(label: string) {
        if (this.context.payload.label.name == label) {
            return true
        } else {
            return false
        }
    }

    public getIssueNumber() {
        return this.context.payload.issue.number
    }

    public getRepoOwner() {
        return this.context.payload.repository.owner.login
    }

    public getRepoName() {
        return this.context.payload.repository.name
    }

    public getIssueUrl() {
        return this.context.payload.issue.html_url
    }

    public getLabelName() {
        return this.context.payload.label.name
    }

    public getIssueId() {
        return this.context.payload.issue.id
    }

    public getIssueTitle() {
        return this.context.payload.issue.title
    }

    public issueWasLabeled() {
        if (this.context.payload.action == 'labeled') {
            return true
        } else {
            return false
        }
    }

    public getIssueBody() {
        return this.context.payload.issue.body
    }

    public getIssueAuthor() {
        return this.context.payload.issue.user.login
    }

    public getTimeIssueCreatedAt() {
        return this.context.payload.issue.created_at
    }

    public getEventAction() {
        return this.context.payload.action
    }

    public getIssueLabels() {
        return this.context.payload.issue.labels
    }

    // specifically for use in issue comment events
    public getIssueComment() {
        return this.context.payload.comment.body
    }

    // specifically for use in issue comment events
    public getCommentCreatedAtTime() {
        return this.context.payload.comment.body
    }

    // uses octokit to fetch list of comments for speficied issue.
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
