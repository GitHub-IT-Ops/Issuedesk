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
var github = require('@actions/github');
var zendesk = require('node-zendesk');
var Gitzen = /** @class */ (function () {
    function Gitzen(myToken, zendeskUsername, zendeskToken, zendeskURI) {
        this.octokit = new github.GitHub(myToken);
        this.context = github.context;
        this.client = zendesk.createClient({
            username: zendeskUsername,
            token: zendeskToken,
            remoteUri: zendeskURI
        });
        this.ticket = { "ticket": { "subject": "", "comment": { "body": "" }, "custom_fields": [] } };
    }
    Gitzen.prototype.returnContext = function () {
        return this.context;
    };
    Gitzen.prototype.getTicketInfo = function (ticketID) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.tickets.show(ticketID)];
                    case 1:
                        ticket = _a.sent();
                        console.log(ticket);
                        return [2 /*return*/];
                }
            });
        });
    };
    Gitzen.prototype.isCorrectLabel = function (label) {
        if (this.context.payload.label.name == label) {
            return true;
        }
        else {
            return false;
        }
    };
    Gitzen.prototype.doesTicketAlreadyExist = function () {
        this.client.tickets.list(function (err, statusList, body, responseList, resultList) {
            if (err) {
                console.log(err);
                return;
            }
            for (var i = 0; i < body.length; i++) {
                console.log(body[i].subject);
            }
        });
    };
    Gitzen.prototype.getIssueNumber = function () {
        return this.context.payload.issue.number;
    };
    Gitzen.prototype.getRepoOwner = function () {
        return this.context.payload.repository.owner.login;
    };
    Gitzen.prototype.getRepoName = function () {
        return this.context.payload.repository.name;
    };
    Gitzen.prototype.getIssueUrl = function () {
        return this.context.payload.issue.url;
    };
    Gitzen.prototype.issueWasLabeled = function () {
        if (this.context.payload.action == "labeled") {
            return true;
        }
        else {
            return false;
        }
    };
    Gitzen.prototype.getLabelEventData = function () {
        return this.context.payload.label;
    };
    Gitzen.prototype.getListOfComments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var owner, repo, issue_number, listOfComments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        owner = this.getRepoOwner();
                        repo = this.getRepoName();
                        issue_number = this.getIssueNumber();
                        return [4 /*yield*/, this.octokit.issues.listComments({ owner: owner, repo: repo, issue_number: issue_number })];
                    case 1:
                        listOfComments = _a.sent();
                        return [2 /*return*/, listOfComments.data];
                }
            });
        });
    };
    Gitzen.prototype.generateTicketBody = function () {
        return __awaiter(this, void 0, void 0, function () {
            var issueThread, ticketBody, i, commenter, createdAt, updatedAt, comment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getListOfComments()];
                    case 1:
                        issueThread = _a.sent();
                        ticketBody = "";
                        for (i = 0; i < issueThread.length; i++) {
                            commenter = issueThread[i].user.login;
                            createdAt = issueThread[i].created_at;
                            updatedAt = issueThread[i].updated_at;
                            comment = issueThread[i].body;
                            ticketBody += "Author: " + commenter + "\nComment: " + comment + " \n*Created at: " + createdAt + "*\n\n";
                        }
                        this.ticket["ticket"]["comment"]["body"] = ticketBody;
                        return [2 /*return*/, ticketBody];
                }
            });
        });
    };
    Gitzen.prototype.createCustomFieldForTicket = function () {
        var issueId = this.getIssueUrl();
        this.ticket["ticket"]["custom_fields"] = [
            {
                "type": "text",
                "gh_id": issueId
            }
        ];
        return this.ticket;
    };
    Gitzen.prototype.generateTicketSubject = function () {
        var subject = this.getIssueUrl();
        this.ticket["ticket"]["subject"] = this.getIssueUrl();
        return this.ticket;
    };
    Gitzen.prototype.generateTicket = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.generateTicketSubject();
                        return [4 /*yield*/, this.generateTicketBody()];
                    case 1:
                        _a.sent();
                        this.createCustomFieldForTicket();
                        return [2 /*return*/];
                }
            });
        });
    };
    Gitzen.prototype.createTicket = function () {
        console.log(this.ticket);
        this.client.tickets.create(this.ticket, function (err, req, result) {
            if (err)
                return handleError(err);
            console.log(JSON.stringify(result, null, 2));
            console.log("Ticket created!");
        });
        function handleError(err) {
            console.log(err);
            process.exit(-1);
        }
    };
    return Gitzen;
}());
exports.Gitzen = Gitzen;
