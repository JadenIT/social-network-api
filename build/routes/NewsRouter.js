Object.defineProperty(exports, "__esModule", { value: true });
var NewsController_1 = require("../controllers/NewsController");
var express_1 = require("express");
var auth_1 = require("../middlewares/auth");
var NewsRouter = (function () {
    function NewsRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    NewsRouter.prototype.routes = function () {
        this.router.get('/', auth_1.default, NewsController_1.default.getNewsByUsername);
    };
    return NewsRouter;
}());
var NewsRouterInstance = new NewsRouter();
exports.default = NewsRouterInstance.router;
