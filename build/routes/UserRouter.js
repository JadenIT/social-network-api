Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UserController_1 = require("../controllers/UserController");
var auth_1 = require("../middlewares/auth");
var UserRouter = (function () {
    function UserRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    UserRouter.prototype.routes = function () {
        this.router.get('/', UserController_1.default.getUsers);
        this.router.post('/', UserController_1.default.createUser);
        this.router.get('/:username', auth_1.default, UserController_1.default.getUserByUsername);
        this.router.post('/update', auth_1.default, UserController_1.default.updateUser);
        this.router.post('/subscribe', auth_1.default, UserController_1.default.subscribeToUser);
        this.router.post('/unsubscribe', auth_1.default, UserController_1.default.unSubscribeFromUser);
        this.router.get('/subscriptions/:username', auth_1.default, UserController_1.default.getSubscriptionsByUsername);
        this.router.get('/subscribers/:username', auth_1.default, UserController_1.default.getSubscribersByUsername);
        this.router.post('/logout', UserController_1.default.logout);
        this.router.get('/suggestions/suggestionsByUsername', auth_1.default, UserController_1.default.suggestionsByUsername);
    };
    return UserRouter;
}());
var UserRouterInstance = new UserRouter();
exports.default = UserRouterInstance.router;
