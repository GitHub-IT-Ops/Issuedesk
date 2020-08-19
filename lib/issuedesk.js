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
exports.IssueDesk = void 0;
var github = require('@actions/github');
var IssueMonitor = require('./issuemonitor.js').IssueMonitor;
var TicketMaker = require('./ticketmaker.js').TicketMaker;
var ZendeskMonitor = require('./zendeskmonitor.js').ZendeskMonitor;
//Passes github & zendesk instances into issuedesk class so that children classes can use them.
//issuedesk class exists primarily to delegate takes to child classes and handle higher order processes, such as deciding whether event even requires action
var IssueDesk = /** @class */ (function () {
    function IssueDesk(myToken, zendeskUsername, zendeskToken, zendeskURI) {
        this.issueMonitor = new IssueMonitor(github.getOctokit(myToken), github.context);
        this.ticketMaker = new TicketMaker();
        this.zendeskMonitor = new ZendeskMonitor(zendeskUsername, zendeskToken, zendeskURI);
    }
    IssueDesk.prototype.getIssueAction = function () {
        return this.issueMonitor.getEventAction();
    };
    IssueDesk.prototype.doesIssueLabelMatchActivationLabel = function (activationLabel, labelName) {
        if (activationLabel === labelName) {
            return true;
        }
        else {
            return false;
        }
    };
    // This function will analyze whether an action should be taken by the IssueDesk class, in event of an issue being labeled
    // Takes argument activationLabel, which is then compared to the labelName.
    // labelName is extracted from this.context info by issueMonitor.getLabelName()
    // If label passes check, IssueDesk extracts info needed to create a zendesk ticket.
    // IssueDesk uses an instance of class TicketMaker to generate a ticket and then create it in zendesk.
    // It does this by using the zendesk.client passed to TicketMaker instance
    IssueDesk.prototype.monitorIssueAndMakeTicket = function (activationLabel) {
        return __awaiter(this, void 0, void 0, function () {
            var labelName, listOfComments, issueUrl, issueTitle, issueBody, issueAuthor, timeIssueCreatedAt, i, githubHandle, commentBody, createdAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        labelName = this.issueMonitor.getLabelName();
                        if (!(activationLabel === labelName)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.issueMonitor.getListOfComments()];
                    case 1:
                        listOfComments = _a.sent();
                        issueUrl = this.issueMonitor.getIssueUrl();
                        issueTitle = this.issueMonitor.getIssueTitle();
                        issueBody = this.issueMonitor.getIssueBody();
                        issueAuthor = this.issueMonitor.getIssueAuthor();
                        timeIssueCreatedAt = this.issueMonitor.getTimeIssueCreatedAt();
                        this.ticketMaker.setExternalId(issueUrl);
                        this.ticketMaker.generateTicketBody(issueBody, issueAuthor, timeIssueCreatedAt, issueUrl);
                        for (i = 0; i < listOfComments.length; i++) {
                            githubHandle = listOfComments[i]['user']['login'];
                            commentBody = listOfComments[i]['body'];
                            createdAt = listOfComments[i]['created_at'];
                            this.ticketMaker.generateTicketComment(githubHandle, commentBody, createdAt);
                        }
                        return [4 /*yield*/, this.zendeskMonitor.createTicketIfItDoesNotExist(issueTitle, this.ticketMaker.getTicketBody(), issueUrl)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        console.log(labelName + " is not an activation label. Ticket will not be created");
                        return [2 /*return*/, false];
                }
            });
        });
    };
    IssueDesk.prototype.updateTicketWithComment = function (activationLabel) {
        return __awaiter(this, void 0, void 0, function () {
            var labelData, i, labelName, commenterGithubHandle, comment, createdAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        labelData = this.issueMonitor.getIssueLabels();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < labelData.length)) return [3 /*break*/, 5];
                        labelName = labelData[i]['name'];
                        if (!(activationLabel === labelName)) return [3 /*break*/, 3];
                        commenterGithubHandle = this.issueMonitor.getIssueAuthor();
                        comment = this.issueMonitor.getIssueComment();
                        createdAt = this.issueMonitor.getCommentCreatedAtTime();
                        this.ticketMaker.generateTicketComment(commenterGithubHandle, comment, createdAt);
                        return [4 /*yield*/, this.zendeskMonitor.updateTicketWithIssueComment(this.ticketMaker.getTicketBody(), this.issueMonitor.getIssueUrl())];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        console.log(activationLabel + " is not an Activation Label.");
                        return [2 /*return*/, false];
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return IssueDesk;
}());
exports.IssueDesk = IssueDesk;
