"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntryController_1 = require("../controllers/EntryController");
var express_1 = require("express");
var storage_1 = require("../middlewares/storage");
var fs_1 = require("fs");
var EntryRouter = (function () {
    function EntryRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    EntryRouter.prototype.createEntry = function (req, res) {
        storage_1.default(req, res, function (err) {
            if (err)
                return res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' });
            var _a = req.body, text = _a.text, username = _a.username, token = _a.token;
            var file = req.files[0] || null;
            var timestamp = Date.now();
            var buffer;
            if (file)
                buffer = fs_1.default.readFileSync("./uploads/" + file.filename);
            EntryController_1.default.create({ username: username, text: text, timestamp: timestamp, token: token, buffer: buffer })
                .then(function (onResolved) {
                res.send({ status: 'ok' });
            })
                .catch(function (error) {
                res.send({ status: 'error' });
            });
        });
    };
    EntryRouter.prototype.Like = function (req, res) {
        var _a = req.body, usernameID = _a.usernameID, usernamePostedPostID = _a.usernamePostedPostID, postID = _a.postID, token = _a.token;
        EntryController_1.default.like(usernameID, usernamePostedPostID, postID, token)
            .then(function (Response) { return res.send({ status: Response }); })
            .catch(function (error) { return res.send({ error: error }); });
    };
    EntryRouter.prototype.Dislike = function (req, res) {
        var _a = req.body, usernameID = _a.usernameID, usernamePostedPostID = _a.usernamePostedPostID, postID = _a.postID, token = _a.token;
        EntryController_1.default.dislike(usernameID, usernamePostedPostID, postID, token)
            .then(function (response) { return res.send(response); })
            .catch(function (error) { return res.send({ error: error }); });
    };
    EntryRouter.prototype.routes = function () {
        this.router.post('/', this.createEntry);
        this.router.post('/like', this.Like);
        this.router.post('/dislike', this.Dislike);
    };
    return EntryRouter;
}());
var EntryRouterInstance = new EntryRouter();
exports.default = EntryRouterInstance.router;
