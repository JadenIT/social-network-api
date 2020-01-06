Object.defineProperty(exports, "__esModule", { value: true });
var DialogController_1 = require("../controllers/DialogController");
var auth_1 = require("../middlewares/auth");
var express_1 = require("express");
var DialogRouter = (function () {
    function DialogRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    DialogRouter.prototype.createDialog = function (req, res) {
        var users = req.body.users;
        DialogController_1.default.createDialog(users)
            .then(function (dialogID) { return res.send({ dialogID: dialogID }); })
            .catch(function (e) { return res.end({ error: e }); });
    };
    DialogRouter.prototype.createMessage = function (req, res) {
        var _a = req.body, message = _a.message, dialogID = _a.dialogID;
        var username = req.auth.username;
        DialogController_1.default.createMessage(username, message, dialogID)
            .then(function (resp) { return res.end({ status: 'ok' }); })
            .catch(function (error) { return res.send({ error: error }); });
    };
    DialogRouter.prototype.getDialogsList = function (req, res) {
        var username = req.auth.username;
        var query = req.query.query;
        DialogController_1.default.getDialogsList(username, query)
            .then(function (dialogs) { return res.send({ dialogs: dialogs }); })
            .catch(function (error) { return res.send({ error: error }); });
    };
    DialogRouter.prototype.getDialog = function (req, res) {
        var dialogID = req.query.dialogID;
        var username = req.auth.username;
        DialogController_1.default.getDialog(dialogID, username)
            .then(function (dialog) { return res.send({ dialog: dialog }); })
            .catch(function (error) { return res.send({ error: error }); });
    };
    DialogRouter.prototype.routes = function () {
        this.router.post('/dialog', auth_1.default, this.createDialog);
        this.router.get('/dialog', auth_1.default, this.getDialog);
        this.router.post('/message', auth_1.default, this.createMessage);
        this.router.get('/dialogs', auth_1.default, this.getDialogsList);
    };
    return DialogRouter;
}());
var DialogRouterInstance = new DialogRouter();
exports.default = DialogRouterInstance.router;
