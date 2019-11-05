"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserModel_1 = require("../models/UserModel");
var jwt = require('jsonwebtoken');
var NewsController = (function () {
    function NewsController() {
    }
    NewsController.prototype.getNewsByArrOfSUbscriptions = function (arr) {
        return new Promise(function (resolve, reject) {
            var newsArr = [];
            if (arr.length <= 0)
                return resolve([]);
            UserModel_1.default.find({ _id: { $in: arr } }, { _id: 0, username: 1, avatar: 1, fullname: 1, posts: 1 })
                .then(function (response) {
                var posts = response.posts;
                var newArr = [];
                response.map(function (el) {
                    el.posts.map(function (el2) {
                        delete el2.username;
                        delete el2.avatar;
                        newArr.push({
                            username: el.username,
                            fullname: el.fullname,
                            avatar: el.avatar,
                            post: el2
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
                .catch(function (error) {
                reject(error);
            });
        });
    };
    NewsController.prototype.getNewsByUsername = function (username, page, perpage, token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            jwt.verify(token, process.env.JWT_KEY, function (error, decoded) {
                if (!decoded)
                    return reject('Not authorized');
                if (decoded.username != username)
                    return reject("Token username doesn't match username from req", []);
                var end = page * perpage;
                var start = end - (perpage - 1) - 1;
                var self = _this;
                UserModel_1.default.findOne({ username: username }, { subscriptions: 1 }, function (error, doc) {
                    if (error)
                        throw error;
                    var subscriptions = (doc || []).subscriptions;
                    if (!subscriptions)
                        resolve([]);
                    self.getNewsByArrOfSUbscriptions(subscriptions)
                        .then(function (news) { return resolve(news.splice(start, perpage)); })
                        .catch(function (error) { return reject(error); });
                });
            });
        });
    };
    return NewsController;
}());
var NewsControllerInstance = new NewsController();
exports.default = NewsControllerInstance;
