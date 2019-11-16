Object.defineProperty(exports, "__esModule", { value: true });
var uniqid = require('uniqid');
var storage_1 = require("../middlewares/storage");
var UserController_1 = require("./UserController");
var UserModel_1 = require("../models/UserModel");
var EntryController = (function () {
    function EntryController() {
    }
    EntryController.prototype.create = function (req, res) {
        try {
            storage_1.default(req, res, function (err) {
                if (err)
                    return res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' });
                var username = req.auth.username;
                var fileURL = req.files[0] ? req.files[0].location : null;
                UserController_1.default.getUserIdByUsername(username).then(function (_id) {
                    UserModel_1.default.updateOne({ username: username }, {
                        $push: {
                            posts: { author: _id, _id: uniqid(), text: req.body.text, username: username, timestamp: Date.now(), likedBy: [], fileURL: fileURL },
                        },
                    }, function (err, result) { return res.send({ status: 'ok' }); });
                });
            });
        }
        catch (error) {
            res.send({ status: 'error', error: error });
        }
    };
    EntryController.prototype.like = function (req, res) {
        try {
            var _a = req.body, usernamePostedPostId_1 = _a.usernamePostedPostId, postID_1 = _a.postID;
            var usernameID_1 = req.auth.user_id;
            UserModel_1.default.find({ $and: [{ _id: { $eq: { usernamePostedPostId: usernamePostedPostId_1 } } }, { 'posts._id': { $eq: postID_1 } }, { 'posts.likedBy._id': { $eq: usernameID_1 } }] }, { posts: 1 }, function (error, doc) {
                if (doc)
                    return res.send({ status: 'error', error: 'Already liked' });
                console.log(usernameID_1);
                UserModel_1.default.updateOne({ $and: [{ _id: { $eq: usernamePostedPostId_1 } }, { 'posts._id': { $eq: postID_1 } }] }, { $push: { 'posts.$.likedBy': { _id: usernameID_1 } } }, function (error, doc) {
                    if (error)
                        throw error;
                    res.send({ status: 'ok' });
                });
            });
        }
        catch (error) {
            res.send({ status: 'error', error: error });
        }
    };
    EntryController.prototype.dislike = function (req, res) {
        try {
            var _a = req.body, usernamePostedPostID = _a.usernamePostedPostID, postID = _a.postID;
            var usernameID = req.auth.user_id;
            UserModel_1.default.updateOne({ _id: { $eq: usernamePostedPostID }, 'posts._id': { $eq: postID } }, {
                $pull: { 'posts.$.likedBy': { _id: usernameID } },
            }, function (error, doc) {
                if (error)
                    return res.send({ status: 'error', error: error });
                res.send({ status: 'ok' });
            });
        }
        catch (error) {
            res.send({ status: 'error', error: error });
        }
    };
    return EntryController;
}());
var EntryControllerInstance = new EntryController();
exports.default = EntryControllerInstance;
