"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZendeskMonitor = void 0;
//This class exists to handle all zendesk related events and data. Will eventually split some of ticketmaker.ts into this class once node-zendesk bug is fixed
var ZendeskMonitor = /** @class */ (function () {
    function ZendeskMonitor(client) {
        this.client = client;
    }
    //Creates ticket in zendesk. Should be called after ticket is generated using generateTicket()
    ZendeskMonitor.prototype.createTicket = function (ticket) {
        this.client.tickets.create(ticket, function (err, req, result) {
            if (err)
                return handleError(err);
            console.log(JSON.stringify(result, null, 2));
            console.log('Ticket created!');
        });
        function handleError(err) {
            console.log(err);
            process.exit(-1);
        }
    };
    // Makes sure ticket doesn't exist, but will create another ticket if ticket containing same external_id, but has status solved or closed
    // This was done to protect against accidentally closed or solved tickets. Once two way communication is implemented between zendesk and github, this will be immensly important
    ZendeskMonitor.prototype.doesTicketAlreadyExist = function (existingTicket, newTicket) {
        if (existingTicket['external_id'] ===
            newTicket['ticket']['external_id'] &&
            existingTicket['status'] !== 'closed' &&
            existingTicket['status'] !== 'solved') {
            return true;
        }
        else {
            return false;
        }
    };
    // Uses callbacks due to node-zendesks 2.0.0 & 1.5.0 version issues at the time.
    // Use of callbacks like this function and createTicketIfItDoesNotExist() should only be used until issue is resolved
    // in node-zendesk library, after that switch it to async/await.
    // Handles entirety of ticket creation process. uses this.client.tickets.list to load all tickets and then runs them through doesTicketAlreadyExist() to make sure duplicate tickets aren't created, if
    // ticket already exist on zendesk. Use this single function to handle all of creation process until bug is solved.
    ZendeskMonitor.prototype.createTicketIfItDoesNotExist = function (ticket) {
        var _this = this;
        this.client.tickets.list(function (err, statusList, existingTickets) {
            for (var i = 0; i < existingTickets.length; i++) {
                var ticketExists = _this.doesTicketAlreadyExist(existingTickets[i], ticket);
                if (ticketExists) {
                    console.log('Ticket already exists! Exiting...');
                    return true;
                }
            }
            _this.createTicket(ticket);
            return false;
        });
    };
    return ZendeskMonitor;
}());
exports.ZendeskMonitor = ZendeskMonitor;
