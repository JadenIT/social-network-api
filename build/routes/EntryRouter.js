Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var EntryController_1 = require("../controllers/EntryController");
var express_1 = require("express");
var storage_1 = require("../middlewares/storage");
var auth_1 = require("../middlewares/auth");
var EntryRouter = (function () {
    function EntryRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    EntryRouter.prototype.createEntry = function (req, res) {
        storage_1.default(req, res, function (err) {
            if (err)
                return res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' });
            var file = req.files[0] || null;
            var buffer;
            if (file)
                buffer = fs.readFileSync("./uploads/" + file.filename);
            var username = req.auth.username;
            EntryController_1.default.create({ username: username, text: req.body.text, timestamp: Date.now(), buffer: buffer })
                .then(function (onResolved) { return res.send({ status: 'ok' }); })
                .catch(function (error) { return res.send({ status: 'error', error: error }); });
        });
    };
    EntryRouter.prototype.Like = function (req, res) {
        var _a = req.body, usernamePostedPostID = _a.usernamePostedPostID, postID = _a.postID;
        var usernameID = req.auth.user_id;
        EntryController_1.default.like(usernameID, usernamePostedPostID, postID)
            .then(function (Response) { return res.send({ status: Response }); })
            .catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    EntryRouter.prototype.Dislike = function (req, res) {
        var _a = req.body, usernamePostedPostID = _a.usernamePostedPostID, postID = _a.postID;
        var usernameID = req.auth.user_id;
        EntryController_1.default.dislike(usernameID, usernamePostedPostID, postID)
            .then(function (response) { return res.send(response); })
            .catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    EntryRouter.prototype.routes = function () {
        this.router.post('/', auth_1.default, this.createEntry);
        this.router.post('/like', auth_1.default, this.Like);
        this.router.post('/dislike', auth_1.default, this.Dislike);
    };
    return EntryRouter;
}());
var EntryRouterInstance = new EntryRouter();
exports.default = EntryRouterInstance.router;
