Object.defineProperty(exports, "__esModule", { value: true });
var AuthController_1 = require("../controllers/AuthController");
var express_1 = require("express");
var AuthRouter = (function () {
    function AuthRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    AuthRouter.prototype.routes = function () {
        this.router.post('/login', AuthController_1.default.login);
        this.router.get('/authorize', AuthController_1.default.Authorize);
    };
    return AuthRouter;
}());
var AuthRouterInstance = new AuthRouter();
exports.default = AuthRouterInstance.router;
