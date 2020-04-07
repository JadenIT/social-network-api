Object.defineProperty(exports, "__esModule", { value: true });
var DialogController_1 = require("../controllers/DialogController");
var auth_1 = require("../middlewares/auth");
var express_1 = require("express");
var DialogRouter = (function () {
    function DialogRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    DialogRouter.prototype.routes = function () {
        this.router.post('/dialog', auth_1.default, DialogController_1.default.createDialog);
        this.router.get('/dialog', auth_1.default, DialogController_1.default.getDialog);
        this.router.get('/dialogs', auth_1.default, DialogController_1.default.getDialogsList);
    };
    return DialogRouter;
}());
var DialogRouterInstance = new DialogRouter();
exports.default = DialogRouterInstance.router;
