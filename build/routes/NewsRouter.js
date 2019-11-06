"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NewsController_1 = require("../controllers/NewsController");
var express_1 = require("express");
var auth_1 = require("../middlewares/auth");
var NewsRouter = (function () {
    function NewsRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    NewsRouter.prototype.getNewsByUsername = function (req, res) {
        var _a = req.query, page = _a.page, perpage = _a.perpage;
        var username = req.auth.username;
        console.log(username);
        NewsController_1.default.getNewsByUsername(username, page, perpage)
            .then(function (news) { return res.send({ news: news }); })
            .catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    NewsRouter.prototype.routes = function () {
        this.router.get('/', auth_1.default, this.getNewsByUsername);
    };
    return NewsRouter;
}());
var NewsRouterInstance = new NewsRouter();
exports.default = NewsRouterInstance.router;
