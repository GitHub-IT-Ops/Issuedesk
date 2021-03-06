"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZendeskMonitor = void 0;
var zendesk = require('node-zendesk');
//This class exists to handle all zendesk related events and data. Will eventually split some of ticketmaker.ts into this class once node-zendesk bug is fixed
var ZendeskMonitor = /** @class */ (function () {
    function ZendeskMonitor(zendeskUsername, zendeskToken, zendeskURI) {
        this.client = zendesk.createClient({
            username: zendeskUsername,
            token: zendeskToken,
            remoteUri: zendeskURI,
        });
    }
    //Creates ticket in zendesk. Should be called after ticket is generated using generateTicket()
    ZendeskMonitor.prototype.createTicket = function (subject, commentBody, external_id) {
        var ticket = {
            ticket: {
                subject: subject,
                comment: { body: commentBody },
                external_id: external_id,
            },
        };
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
    ZendeskMonitor.prototype.isTicketOpen = function (ticketStatus) {
        if (ticketStatus !== 'closed' && ticketStatus !== 'solved') {
            return true;
        }
        else {
            return false;
        }
    };
    // Makes sure ticket doesn't exist, but will create another ticket if ticket containing same external_id, but has status solved or closed
    // This was done to protect against accidentally closed or solved tickets. Once two way communication is implemented between zendesk and github, this will be immensly important
    ZendeskMonitor.prototype.doesTicketAlreadyExist = function (existingTicketStatus, existingTicketExternalId, newTicketExternalId) {
        var ticketIsOpen = this.isTicketOpen(existingTicketStatus);
        if (existingTicketExternalId === newTicketExternalId && ticketIsOpen) {
            return true;
        }
        else {
            return false;
        }
    };
    ZendeskMonitor.prototype.updateTicketWithIssueComment = function (commentBody, external_id) {
        return __awaiter(this, void 0, void 0, function () {
            var allZendeskTickets, _loop_1, this_1, i, state_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllZendeskTickets()];
                    case 1:
                        allZendeskTickets = _a.sent();
                        _loop_1 = function (i) {
                            var ticketExists, ticket;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        ticketExists = this_1.doesTicketAlreadyExist(allZendeskTickets[i]['status'], allZendeskTickets[i]['external_id'], external_id);
                                        if (!ticketExists) return [3 /*break*/, 2];
                                        ticket = {
                                            ticket: {
                                                comment: { body: commentBody },
                                            },
                                        };
                                        return [4 /*yield*/, this_1.client.tickets.update(allZendeskTickets[i]['id'], ticket, function () {
                                                console.log("Ticket #" + allZendeskTickets[i]['id'] + " has been updated!");
                                            })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, { value: true }];
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < allZendeskTickets.length)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1(i)];
                    case 3:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, false];
                }
            });
        });
    };
    ZendeskMonitor.prototype.getAllZendeskTickets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) {
                            _this.client.tickets.list(function (err, statusList, body) {
                                try {
                                    resolve(body);
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Uses callbacks due to node-zendesks 2.0.0 & 1.5.0 version issues at the time.
    // Use of callbacks like this function and createTicketIfItDoesNotExist() should only be used until issue is resolved
    // in node-zendesk library, after that switch it to async/await.
    // Handles entirety of ticket creation process. uses this.client.tickets.list to load all tickets and then runs them through doesTicketAlreadyExist() to make sure duplicate tickets aren't created, if
    // ticket already exist on zendesk. Use this single function to handle all of creation process until bug is solved.
    ZendeskMonitor.prototype.createTicketIfItDoesNotExist = function (subject, commentBody, external_id) {
        return __awaiter(this, void 0, void 0, function () {
            var allZendeskTickets, i, ticketExists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllZendeskTickets()];
                    case 1:
                        allZendeskTickets = _a.sent();
                        for (i = 0; i < allZendeskTickets.length; i++) {
                            ticketExists = this.doesTicketAlreadyExist(allZendeskTickets[i]['status'], allZendeskTickets[i]['external_id'], external_id);
                            if (ticketExists) {
                                console.log('Ticket already exists! Exiting...');
                                return [2 /*return*/, true];
                            }
                        }
                        this.createTicket(subject, commentBody, external_id);
                        return [2 /*return*/, false];
                }
            });
        });
    };
    return ZendeskMonitor;
}());
exports.ZendeskMonitor = ZendeskMonitor;
