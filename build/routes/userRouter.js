"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UserController_1 = require("../controllers/UserController");
var storage_1 = require("../middlewares/storage");
var UserRouter = (function () {
    function UserRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    UserRouter.prototype.CreateUser = function (req, res) {
        var _a = req.body, fullName = _a.fullName, username = _a.username, password = _a.password;
        UserController_1.default.createUser({ fullName: fullName, username: username, password: password })
            .then(function (response) { return res.send({ status: 'ok' }); })
            .catch(function (err) { return res.send({ status: 'error', error: err }); });
    };
    UserRouter.prototype.UpdateUser = function (req, res) {
        storage_1.default(req, res, function (err) {
            if (err) {
                res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' });
            }
            else {
                var _a = req.body, oldUsername_1 = _a.oldUsername, newUsername_1 = _a.newUsername, newPassword = _a.newPassword, newAbout = _a.newAbout, newFullname = _a.newFullname;
                var newAvatar = req.files[0] || null;
                var avatarBuffer = void 0;
                if (newAvatar) {
                    avatarBuffer = fs.readFileSync("./uploads/" + newAvatar.filename);
                }
                userController
                    .updateUser(oldUsername_1, newUsername_1, newFullname, newPassword, newAbout, avatarBuffer)
                    .then(function (onResolved) {
                    jwt.sign({ username: newUsername_1 ? newUsername_1 : oldUsername_1 }, process.env.JWT_KEY, function (err, token) {
                        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                            maxAge: 60 * 60 * 24 * 7
                        }));
                        res.send({ status: 'ok' });
                    });
                })
                    .catch(function (error) {
                    res.send({ status: 'error', error: 'error' });
                });
            }
        });
        res.send({ status: 'ok' });
    };
    UserRouter.prototype.GetUser = function (req, res) {
        var username = req.params.username;
        UserController_1.default.getUserByUsername(username)
            .then(function (response) { return res.send({ user: response }); })
            .catch(function (error) { return res.send({ error: error }); });
    };
    UserRouter.prototype.Subscribe = function (req, res) {
        var _a = req.body, usernameID = _a.usernameID, usernameToSubscribeID = _a.usernameToSubscribeID;
        UserController_1.default.subscribe(usernameID, usernameToSubscribeID)
            .then(function (response) { return res.send({ response: response }); })
            .catch(function (error) { return res.send({ status: 'error' }); });
    };
    UserRouter.prototype.UnSubscribe = function (req, res) {
        var _a = req.body, usernameID = _a.usernameID, usernameToSubscribeID = _a.usernameToSubscribeID;
        UserController_1.default.unSubscribe(usernameID, usernameToSubscribeID)
            .then(function (response) { return res.send({ status: 'ok', response: response }); })
            .catch(function (error) { return res.send({ status: 'error' }); });
    };
    UserRouter.prototype.GetSubscriptionsByUsername = function (req, res) {
        var username = req.query.username;
        UserController_1.default.getSubscriptionsByUsername(username)
            .then(function (subscriptions) {
            res.send({
                status: 'ok',
                subscriptions: subscriptions
            });
        })
            .catch(function (error) { return res.send({ status: 'error' }); });
    };
    UserRouter.prototype.routes = function () {
        this.router.post('/', this.CreateUser);
        this.router.get('/:username', this.GetUser);
        this.router.put('/:username', this.UpdateUser);
    };
    return UserRouter;
}());
var UserRouterInstance = new UserRouter();
exports.default = UserRouterInstance.router;
