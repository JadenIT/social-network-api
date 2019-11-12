Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var SearchController_1 = require("../controllers/SearchController");
var auth_1 = require("../middlewares/auth");
var SearchRouter = (function () {
    function SearchRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    SearchRouter.prototype.routes = function () {
        this.router.get('/', auth_1.default, SearchController_1.default.searchByQueryForUsernameOrFullName);
    };
    return SearchRouter;
}());
var SearchRouterInstance = new SearchRouter();
exports.default = SearchRouterInstance.router;
