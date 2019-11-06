"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookie = require('cookie');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var express_1 = require("express");
var UserController_1 = require("../controllers/UserController");
var storage_1 = require("../middlewares/storage");
var index_1 = require("../config/index");
var auth_1 = require("../middlewares/auth");
var UserRouter = (function () {
    function UserRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    UserRouter.prototype.CreateUser = function (req, res) {
        var _a = req.body, fullName = _a.fullName, username = _a.username, password = _a.password;
        UserController_1.default.createUser({ fullName: fullName, username: username, password: password })
            .then(function (user_id) {
            jwt.sign({ user_id: user_id, username: username }, index_1.default.JWT_KEY, function (err, token) {
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    maxAge: 60 * 60 * 24 * 7,
                    path: '/'
                }));
                res.send({ status: 'ok' });
            });
        })
            .catch(function (err) { return res.send({ status: 'error', error: err }); });
    };
    UserRouter.prototype.UpdateUser = function (req, res) {
        storage_1.default(req, res, function (err) {
            if (err) {
                res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' });
            }
            else {
                var _a = req.body, oldUsername_1 = _a.oldUsername, newUsername_1 = _a.newUsername, newPassword = _a.newPassword, newAbout = _a.newAbout, newFullname = _a.newFullname;
                var newAvatar = req.files ? req.files[0] : null;
                var avatarBuffer = void 0;
                if (newAvatar) {
                    avatarBuffer = fs.readFileSync("./uploads/" + newAvatar.filename);
                }
                var newFullName = newFullname;
                UserController_1.default.updateUser({ oldUsername: oldUsername_1, newUsername: newUsername_1, newFullName: newFullName, newPassword: newPassword, newAbout: newAbout, avatarBuffer: avatarBuffer })
                    .then(function (onResolved) {
                    jwt.sign({ username: newUsername_1 ? newUsername_1 : oldUsername_1 }, index_1.default.JWT_KEY, function (err, token) {
                        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                            maxAge: 60 * 60 * 24 * 7,
                            path: '/'
                        }));
                        res.send({ status: 'ok' });
                    });
                })
                    .catch(function (error) {
                    res.send({ status: 'error', error: 'error' });
                });
            }
        });
    };
    UserRouter.prototype.GetUser = function (req, res) {
        var username = req.params.username;
        UserController_1.default.getUserByUsername(username)
            .then(function (response) { return res.send({ user: response }); })
            .catch(function (error) { return res.send({ error: error }); });
    };
    UserRouter.prototype.Subscribe = function (req, res) {
        var usernameToSubscribeID = req.body.usernameToSubscribeID;
        var usernameID = req.auth.user_id;
        UserController_1.default.subscribe(usernameID, usernameToSubscribeID)
            .then(function (response) { return res.send({ status: 'ok' }); })
            .catch(function (error) { return res.send({ status: 'error' }); });
    };
    UserRouter.prototype.UnSubscribe = function (req, res) {
        var usernameToSubscribeID = req.body.usernameToSubscribeID;
        var usernameID = req.auth.user_id;
        UserController_1.default.unSubscribe(usernameID, usernameToSubscribeID)
            .then(function (response) { return res.send({ status: 'ok', response: response }); })
            .catch(function (error) { return res.send({ status: 'error' }); });
    };
    UserRouter.prototype.GetSubscriptionsByUsername = function (req, res) {
        var username = req.params.username;
        UserController_1.default.getSubscriptionsByUsername(username)
            .then(function (subscriptions) {
            res.send({
                status: 'ok',
                subscriptions: subscriptions
            });
        })
            .catch(function (error) { return res.send({ status: 'error' }); });
    };
    UserRouter.prototype.Logout = function (req, res) {
        res.setHeader('Set-Cookie', cookie.serialize('token', 'null', {
            expires: new Date(),
            path: '/'
        }));
        res.send({ status: 'ok' });
    };
    UserRouter.prototype.routes = function () {
        this.router.post('/', this.CreateUser);
        this.router.get('/:username', auth_1.default, this.GetUser);
        this.router.post('/update', auth_1.default, this.UpdateUser);
        this.router.post('/subscribe', auth_1.default, this.Subscribe);
        this.router.post('/unsubscribe', auth_1.default, this.UnSubscribe);
        this.router.get('/subscriptions/:username', auth_1.default, this.GetSubscriptionsByUsername);
        this.router.post('/logout', this.Logout);
    };
    return UserRouter;
}());
var UserRouterInstance = new UserRouter();
exports.default = UserRouterInstance.router;
