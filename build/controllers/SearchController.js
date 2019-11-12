Object.defineProperty(exports, "__esModule", { value: true });
var UserModel_1 = require("../models/UserModel");
var SearchController = (function () {
    function SearchController() {
    }
    SearchController.prototype.searchByQueryForUsernameOrFullName = function (req, res) {
        try {
            var query = req.query.query;
            var q = new RegExp(query, 'i');
            UserModel_1.default.find({
                $or: [{ username: q }, { fullname: q }],
            }, {
                username: 1,
                fullname: 1,
                avatar: 1,
            }, function (error, docs) {
                if (error)
                    res.send({ status: 'error', error: error });
                res.send({ search: docs });
            });
        }
        catch (error) {
            res.send({ status: 'error', error: error });
        }
    };
    return SearchController;
}());
var SearchControllerInstance = new SearchController();
exports.default = SearchControllerInstance;
