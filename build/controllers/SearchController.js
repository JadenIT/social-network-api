Object.defineProperty(exports, "__esModule", { value: true });
var UserModel_1 = require("../models/UserModel");
var SearchController = (function () {
    function SearchController() {
    }
    SearchController.prototype.searchByQueryForUsernameOrFullName = function (req, res) {
        return new Promise(function (resolve, reject) {
            var query = req.query.query;
            var q = new RegExp(query, 'i');
            UserModel_1.default.find({ $or: [{ username: q }, { fullname: q }], }, { password: 0 }, function (err, docs) {
                if (err)
                    reject(err);
                resolve(docs);
            });
        }).then(function (Arr) { return res.send({ search: Arr }); });
    };
    return SearchController;
}());
var SearchControllerInstance = new SearchController();
exports.default = SearchControllerInstance;
