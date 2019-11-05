"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var DialogController_1 = require("../controllers/DialogController");
var DialogRouter = (function () {
    function DialogRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    DialogRouter.prototype.CreateDialog = function (req, res) {
        var _a = req.body, users = _a.users, token = _a.token;
        DialogController_1.default.createDialog(users, token)
            .then(function (dialogID) { return res.send({ dialogID: dialogID }); })
            .catch(function (error) { return res.send({ error: error }); });
    };
    DialogRouter.prototype.CreateMessage = function (req, res) {
        var _a = req.body, username = _a.username, message = _a.message, dialogID = _a.dialogID, token = _a.token;
        DialogController_1.default.createMessage(username, message, dialogID, token)
            .then(function (resp) { return res.end({ status: 'ok' }); })
            .catch(function (error) { return res.send({ error: error }); });
    };
    DialogRouter.prototype.GetMessages = function (req, res) {
        var _a = req.query, username = _a.username, token = _a.token;
        DialogController_1.default.getMessages(username, token)
            .then(function (dialogs) {
            res.send({ dialogs: dialogs });
        })
            .catch(function (error) { return res.send({ error: error }); });
    };
    DialogRouter.prototype.getDialog = function (req, res) {
        var _a = req.query, dialogID = _a.dialogID, token = _a.token;
        DialogController_1.default.getDialog(dialogID, token)
            .then(function (dialog) { return res.send({ dialog: dialog }); })
            .catch(function (error) { return res.send({ error: error }); });
    };
    DialogRouter.prototype.routes = function () {
        this.router.get('/', this.searchByQueryForUsernameOrFullName);
    };
    return DialogRouter;
}());
var DialogRouterInstance = new DialogRouter();
exports.default = DialogRouterInstance.router;
