Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var DialogController_1 = require("../controllers/DialogController");
var auth_1 = require("../middlewares/auth");
var DialogRouter = (function () {
    function DialogRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    DialogRouter.prototype.CreateDialog = function (req, res) {
        var users = req.body.users;
        DialogController_1.default.createDialog(users)
            .then(function (dialogID) { return res.send({ dialogID: dialogID }); })
            .catch(function (e) { return res.end({ error: e }); });
    };
    DialogRouter.prototype.CreateMessage = function (req, res) {
        var _a = req.body, message = _a.message, dialogID = _a.dialogID;
        var username = req.auth.username;
        DialogController_1.default.createMessage(username, message, dialogID)
            .then(function (resp) { return res.end({ status: 'ok' }); })
            .catch(function (error) { return res.send({ error: error }); });
    };
    DialogRouter.prototype.GetMessages = function (req, res) {
        var username = req.auth.username;
        var query = req.query.query;
        DialogController_1.default.getMessages(username, query)
            .then(function (dialogs) { return res.send({ dialogs: dialogs }); })
            .catch(function (error) { return res.send({ error: error }); });
    };
    DialogRouter.prototype.getDialog = function (req, res) {
        var dialogID = req.query.dialogID;
        DialogController_1.default.getDialog(dialogID)
            .then(function (dialog) { return res.send({ dialog: dialog }); })
            .catch(function (error) { return res.send({ error: error }); });
    };
    DialogRouter.prototype.routes = function () {
        this.router.post('/dialog', auth_1.default, this.CreateDialog);
        this.router.get('/dialog', auth_1.default, this.getDialog);
        this.router.post('/message', auth_1.default, this.CreateMessage);
        this.router.get('/dialogs', auth_1.default, this.GetMessages);
    };
    return DialogRouter;
}());
var DialogRouterInstance = new DialogRouter();
exports.default = DialogRouterInstance.router;
