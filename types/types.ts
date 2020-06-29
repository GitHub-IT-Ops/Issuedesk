interface ticketType {
    ticket: {
        subject: string
        comment: { body: string }
        external_id: string
    }
}

interface listOfCommentsType {
    id: number
    node_id: string
    url: string
    html_url: string
    body: string
    user: {
        login: string
        id: number
        node_id: string
        avatar_url: string
        gravatar_id: string
        url: string
        html_url: string
        followers_url: string
        following_url: string
        gists_url: string
        starred_url: string
        subscriptions_url: string
        organizations_url: string
        repos_url: string
        events_url: string
        received_events_url: string
        type: string
        site_admin: false
    }
    created_at: string
    updated_at: string
}

export { ticketType, listOfCommentsType }
