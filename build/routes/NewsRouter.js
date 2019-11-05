"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NewsController_1 = require("../controllers/NewsController");
var express_1 = require("express");
var NewsRouter = (function () {
    function NewsRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    NewsRouter.prototype.getNewsByUsername = function (req, res) {
        var _a = req.query, username = _a.username, page = _a.page, perpage = _a.perpage, token = _a.token;
        NewsController_1.default.getNewsByUsername(username, page, perpage, token)
            .then(function (news) { return res.send({ news: news }); })
            .catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    NewsRouter.prototype.routes = function () {
        this.router.get('/', this.getNewsByUsername);
    };
    return NewsRouter;
}());
var NewsRouterInstance = new NewsRouter();
exports.default = NewsRouterInstance.router;
