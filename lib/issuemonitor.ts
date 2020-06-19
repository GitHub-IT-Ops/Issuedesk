class IssueMonitor {
    octokit: any
    context: any
    constructor(
        octokit: any,
        context: any
    ) {
        this.octokit = octokit
        this.context = context
    }
}

export{ IssueMonitor }