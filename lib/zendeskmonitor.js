"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZendeskMonitor = void 0;
//This class exists to handle all zendesk related events and data. Will eventually split some of ticketmaker.ts into this class once node-zendesk bug is fixed
var ZendeskMonitor = /** @class */ (function () {
    function ZendeskMonitor(client) {
        this.client = client;
    }
    return ZendeskMonitor;
}());
exports.ZendeskMonitor = ZendeskMonitor;
