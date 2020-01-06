Object.defineProperty(exports, "__esModule", { value: true });
var UserModel_1 = require("../models/UserModel");
var NewsController = (function () {
    function NewsController() {
    }
    NewsController.getNewsByArrOfSubscriptions = function (arr) {
        return new Promise(function (resolve, reject) {
            if (arr.length <= 0)
                return resolve([]);
            UserModel_1.default.find({ _id: { $in: arr } }, {
                _id: 0,
                username: 1,
                avatar: 1,
                fullname: 1,
                posts: 1,
            })
                .then(function (response) {
                var newArr = [];
                response.map(function (el) {
                    el.posts.map(function (el2) {
                        delete el2.username;
                        delete el2.avatar;
                        newArr.push({
                            username: el.username,
                            fullname: el.fullname,
                            avatar: el.avatar,
                            post: el2,
                        });
                    });
                });
                newArr.sort(function (a, b) {
                    if (a.post.timestamp > b.post.timestamp) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                });
                resolve(newArr);
            })
                .catch(function (error) { return reject(error); });
        });
    };
    NewsController.prototype.getNewsByUsername = function (req, res) {
        return new Promise(function (resolve, reject) {
            var _a = req.query, page = _a.page, perpage = _a.perpage;
            var username = req.auth.username;
            var end = page * perpage;
            var start = end - (perpage - 1) - 1;
            UserModel_1.default.findOne({ username: username }, { subscriptions: 1 }, function (err, doc) {
                if (err)
                    reject(err);
                var subscriptions = (doc || []).subscriptions;
                if (!subscriptions)
                    return resolve([]);
                NewsController.getNewsByArrOfSubscriptions(subscriptions)
                    .then(function (news) { return resolve(news.splice(start, perpage)); })
                    .catch(function (err) { return reject(err); });
            });
        }).then(function (news) { return res.send({ news: news }); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    return NewsController;
}());
var NewsControllerInstance = new NewsController();
exports.default = NewsControllerInstance;
