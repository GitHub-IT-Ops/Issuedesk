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
exports.IssueMonitor = void 0;
//This class exists to handle all github related events and data. Most of the function names explain their purpose and just pull and return info from this.context
var IssueMonitor = /** @class */ (function () {
    function IssueMonitor(octokit, context) {
        this.octokit = octokit;
        this.context = context;
    }
    // exists soley for test function check
    IssueMonitor.prototype.getContext = function () {
        return this.context;
    };
    IssueMonitor.prototype.isCorrectLabel = function (label) {
        if (this.context.payload.label.name == label) {
            return true;
        }
        else {
            return false;
        }
    };
    IssueMonitor.prototype.getIssueNumber = function () {
        return this.context.payload.issue.number;
    };
    IssueMonitor.prototype.getRepoOwner = function () {
        return this.context.payload.repository.owner.login;
    };
    IssueMonitor.prototype.getRepoName = function () {
        return this.context.payload.repository.name;
    };
    IssueMonitor.prototype.getIssueUrl = function () {
        return this.context.payload.issue.html_url;
    };
    IssueMonitor.prototype.getLabelName = function () {
        return this.context.payload.label.name;
    };
    IssueMonitor.prototype.getIssueId = function () {
        return this.context.payload.issue.id;
    };
    IssueMonitor.prototype.getIssueTitle = function () {
        return this.context.payload.issue.title;
    };
    IssueMonitor.prototype.issueWasLabeled = function () {
        if (this.context.payload.action == 'labeled') {
            return true;
        }
        else {
            return false;
        }
    };
    IssueMonitor.prototype.getIssueBody = function () {
        return this.context.payload.issue.body;
    };
    IssueMonitor.prototype.getIssueAuthor = function () {
        return this.context.payload.issue.user.login;
    };
    IssueMonitor.prototype.getTimeIssueCreatedAt = function () {
        return this.context.payload.issue.created_at;
    };
    IssueMonitor.prototype.getEventAction = function () {
        return this.context.payload.action;
    };
    // uses octokit to fetch list of comments for speficied issue.
    IssueMonitor.prototype.getListOfComments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var owner, repo, issue_number, listOfComments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        owner = this.getRepoOwner();
                        repo = this.getRepoName();
                        issue_number = this.getIssueNumber();
                        return [4 /*yield*/, this.octokit.issues.listComments({
                                owner: owner,
                                repo: repo,
                                issue_number: issue_number,
                            })];
                    case 1:
                        listOfComments = _a.sent();
                        return [2 /*return*/, listOfComments.data];
                }
            });
        });
    };
    return IssueMonitor;
}());
exports.IssueMonitor = IssueMonitor;
