Object.defineProperty(exports, "__esModule", { value: true });
var uniqid = require('uniqid');
var storage_1 = require("../middlewares/storage");
var UserController_1 = require("./UserController");
var UserModel_1 = require("../models/UserModel");
var EntryController = (function () {
    function EntryController() {
    }
    EntryController.prototype.create = function (req, res) {
        return new Promise(function (resolve, reject) {
            storage_1.default(req, res, function (err) {
                if (err)
                    return reject('Произошла ошибка, скорее всего файл слишком большой');
                var username = req.auth.username;
                var fileURL = req.files[0] ? req.files[0].location : null;
                UserController_1.default.getUserIdByUsername(username).then(function (_id) {
                    UserModel_1.default.updateOne({ username: username }, { $push: { posts: { author: _id, _id: uniqid(), text: req.body.text, username: username, timestamp: Date.now(), likedBy: [], fileURL: fileURL }, }, }, function (err, result) {
                        if (err)
                            return reject(err);
                        resolve();
                    });
                });
            });
        }).then(function (response) { return res.send({ status: 'ok' }); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    EntryController.prototype.like = function (req, res) {
        return new Promise(function (resolve, reject) {
            var _a = req.body, usernamePostedPostId = _a.usernamePostedPostId, postID = _a.postID;
            var usernameID = req.auth.user_id;
            UserModel_1.default.find({ $and: [{ _id: { $eq: { usernamePostedPostId: usernamePostedPostId } } }, { 'posts._id': { $eq: postID } }, { 'posts.likedBy._id': { $eq: usernameID } }] }, { posts: 1 }, function (err, doc) {
                if (err)
                    reject(err);
                if (doc)
                    return reject('Already liked');
                UserModel_1.default.updateOne({ $and: [{ _id: { $eq: usernamePostedPostId } }, { 'posts._id': { $eq: postID } }] }, { $push: { 'posts.$.likedBy': { _id: usernameID } } }, function (err, doc) {
                    if (err)
                        reject(err);
                    resolve();
                });
            });
        }).then(function (response) { return res.send({ status: 'ok' }); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    EntryController.prototype.dislike = function (req, res) {
        return new Promise(function (resolve, reject) {
            var _a = req.body, usernamePostedPostID = _a.usernamePostedPostID, postID = _a.postID;
            var usernameID = req.auth.user_id;
            UserModel_1.default.updateOne({ _id: { $eq: usernamePostedPostID }, 'posts._id': { $eq: postID } }, { $pull: { 'posts.$.likedBy': { _id: usernameID } }, }, function (err, doc) {
                if (err)
                    reject(err);
                resolve();
            });
        }).then(function (response) { return res.send({ status: 'ok' }); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    return EntryController;
}());
var EntryControllerInstance = new EntryController();
exports.default = EntryControllerInstance;
