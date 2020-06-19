"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueMonitor = void 0;
var IssueMonitor = /** @class */ (function () {
    function IssueMonitor(octokit, context) {
        this.octokit = octokit;
        this.context = context;
    }
    return IssueMonitor;
}());
exports.IssueMonitor = IssueMonitor;
