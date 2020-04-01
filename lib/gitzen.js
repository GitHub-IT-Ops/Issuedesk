"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var zendesk = require("node-zendesk");
var github = require('@actions/github');
var core = require('@actions/core');
var Gitzen = /** @class */ (function (_super) {
    __extends(Gitzen, _super);
    function Gitzen() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Gitzen.prototype.contructor = function (zendeskUsername, zendeskToken, zendeskURI) {
        this.client = zendesk.createClient({
            username: zendeskUsername,
            token: zendeskToken,
            remoteUri: zendeskURI
        });
        this.ticketInfo = {};
    };
    Gitzen.prototype.isCorrectLabel = function () {
    };
    Gitzen.prototype.doesTicketAlreadyExist = function () {
    };
    Gitzen.prototype.getIssueNumber = function () {
    };
    Gitzen.prototype.getRepoName = function () {
    };
    Gitzen.prototype.getIssueLabels = function () {
    };
    Gitzen.prototype.containsCommand = function () {
    };
    Gitzen.prototype.generateTicket = function () {
    };
    Gitzen.prototype.createTicket = function (ticket) {
    };
    return Gitzen;
}(zendesk));
