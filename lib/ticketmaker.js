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
exports.TicketMaker = void 0;
var TicketMaker = /** @class */ (function () {
    function TicketMaker(client) {
        this.client = client;
        this.ticket = {
            ticket: { subject: '', comment: { body: '' }, external_id: '' },
        };
    }
    TicketMaker.prototype.getTicketInfo = function (ticketID) {
        this.client.ticket.show(ticketID, function (data) {
            console.log(data);
        });
    };
    TicketMaker.prototype.setExternalId = function (externalId) {
        return (this.ticket['ticket']['external_id'] = externalId);
    };
    TicketMaker.prototype.generateTicketBody = function (listOfComments, issueUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var ticketBody, i, commenter, createdAt, comment;
            return __generator(this, function (_a) {
                ticketBody = '';
                for (i = 0; i < listOfComments.length; i++) {
                    commenter = listOfComments[i].user.login;
                    createdAt = listOfComments[i].created_at;
                    comment = listOfComments[i].body;
                    ticketBody += "Author: " + commenter + "\nComment: " + comment + " \n*Created at: " + createdAt + "*\n\n";
                }
                ticketBody += "\n\n\nOriginal issue can be found at " + issueUrl;
                this.ticket['ticket']['comment']['body'] = ticketBody;
                return [2 /*return*/, ticketBody];
            });
        });
    };
    TicketMaker.prototype.generateTicketSubject = function (issueTitle) {
        this.ticket['ticket']['subject'] = issueTitle;
        return this.ticket;
    };
    TicketMaker.prototype.generateTicket = function (issueUrl, issueTitle, listOfComments) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setExternalId(issueUrl);
                        this.generateTicketSubject(issueTitle);
                        return [4 /*yield*/, this.generateTicketBody(listOfComments, issueUrl)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TicketMaker.prototype.createTicket = function () {
        this.client.tickets.create(this.ticket, function (err, req, result) {
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
    // I hate that this function is neccesary. This is one of the 3 functions made to offset the bug in node-zendesk that prevents promises from working.
    // This function exists soley to complete the creation process by nesting inside doesTicketAlreadyExist(). Remove as soon as possible in favor of async / await
    TicketMaker.prototype.ticketCreation = function (issueUrl, issueTitle, listOfComments) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generateTicket(issueUrl, issueTitle, listOfComments)];
                    case 1:
                        _a.sent();
                        this.createTicket();
                        return [2 /*return*/];
                }
            });
        });
    };
    TicketMaker.prototype.doesTicketAlreadyExist = function (ticket, issueUrl) {
        if (ticket['external_id'] === issueUrl &&
            ticket['status'] !== 'solved') {
            return true;
        }
        else {
            return false;
        }
    };
    // This exists to prevent duplicate tickets from being created and prevent tickets not being opened if original is closed as Solved
    // and then reopened.
    // Split into a seperate function due to node-zendesks 2.0.0 & 1.5.0 version issues at the time.
    // Use of callbacks like this function and createTicketIfItDoesNotExist() should only be used until issue is resolved
    // in node-zendesk library.
    TicketMaker.prototype.createTicketIfItDoesNotExist = function (body, issueUrl, issueTitle, listOfComments) {
        var _this = this;
        this.client.tickets.list(function (err, statusList, body) {
            for (var i = 0; i < body.length; i++) {
                var ticketExists = _this.doesTicketAlreadyExist(body[i], issueUrl);
                if (ticketExists) {
                    console.log('Ticket already exists! Exiting...');
                    return true;
                }
            }
            _this.ticketCreation(issueUrl, issueTitle, listOfComments);
            return false;
        });
    };
    return TicketMaker;
}());
exports.TicketMaker = TicketMaker;
