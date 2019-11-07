Object.defineProperty(exports, "__esModule", { value: true });
var UserModel_1 = require("../models/UserModel");
var SearchController = (function () {
    function SearchController() {
    }
    SearchController.prototype.searchByQueryForUsernameOrFullName = function (query) {
        return new Promise(function (resolve, reject) {
            var q = new RegExp(query, 'i');
            UserModel_1.default.find({
                $or: [{ username: q }, { fullname: q }]
            }, {
                username: 1,
                fullname: 1,
                avatar: 1
            }, function (error, docs) {
                if (error)
                    return reject(error);
                resolve(docs);
            });
        });
    };
    return SearchController;
}());
var SearchControllerInstance = new SearchController();
exports.default = SearchControllerInstance;
