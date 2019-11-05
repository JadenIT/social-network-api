"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var SearchController_1 = require("../controllers/SearchController");
var SearchRouter = (function () {
    function SearchRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    SearchRouter.prototype.searchByQueryForUsernameOrFullName = function (req, res) {
        var query = req.query.query;
        SearchController_1.default.searchByQueryForUsernameOrFullName(query)
            .then(function (docs) { return res.send({ search: docs }); })
            .catch(function (error) { return res.send({ status: 'error' }); });
    };
    SearchRouter.prototype.routes = function () {
        this.router.get('/', this.searchByQueryForUsernameOrFullName);
    };
    return SearchRouter;
}());
var SearchRouterInstance = new SearchRouter();
exports.default = SearchRouterInstance.router;
