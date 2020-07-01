
//This class exists to handle all zendesk related events and data. Will eventually split some of ticketmaker.ts into this class once node-zendesk bug is fixed
class ZendeskMonitor {
    client: any
    constructor(client: any) {
        this.client = client
    }
}

export { ZendeskMonitor }
