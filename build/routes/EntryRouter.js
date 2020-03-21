Object.defineProperty(exports, "__esModule", { value: true });
var EntryController_1 = require("../controllers/EntryController");
var express_1 = require("express");
var auth_1 = require("../middlewares/auth");
var EntryRouter = (function () {
    function EntryRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    EntryRouter.prototype.routes = function () {
        this.router.post('/', auth_1.default, EntryController_1.default.create);
        this.router.post('/like', auth_1.default, EntryController_1.default.like);
        this.router.post('/dislike', auth_1.default, EntryController_1.default.dislike);
        this.router.post('/delete', auth_1.default, EntryController_1.default.delete);
    };
    return EntryRouter;
}());
var EntryRouterInstance = new EntryRouter();
exports.default = EntryRouterInstance.router;
