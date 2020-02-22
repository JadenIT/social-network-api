Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require('bcrypt');
var cookie = require('cookie');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var UserModel_1 = require("../models/UserModel");
var config_1 = require("../config");
var AuthController = (function () {
    function AuthController() {
    }
    AuthController.prototype.login = function (req, res) {
        return new Promise(function (resolve, reject) {
            var _a = req.body, username = _a.username, password = _a.password;
            if (!_.trim(username) || !_.trim(password))
                return reject('Не все поля заполнены');
            UserModel_1.default.findOne({ username: username }, function (err, doc) {
                if (!doc)
                    return reject('Неправильное имя пользователя');
                if (err)
                    return reject(err);
                bcrypt.compare(password, doc.password, function (err, hash) {
                    if (!hash)
                        return reject('Неверный пароль');
                    jwt.sign({ user_id: doc._id, username: username }, config_1.default.JWT_KEY, function (err, token) {
                        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                            maxAge: 60 * 60 * 24 * 7,
                            path: '/',
                        }));
                        resolve();
                    });
                });
            });
        }).then(function (response) { return res.send({ status: 'ok' }); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    AuthController.prototype.Authorize = function (req, res) {
        return new Promise(function (resolve, reject) {
            var token = req.cookies.token;
            if (!token)
                return res.send({ isAuthorized: false, token: null });
            jwt.verify(token, config_1.default.JWT_KEY, function (err, decoded) {
                if (err)
                    reject(err);
                resolve({
                    isAuthorized: decoded,
                    token: token,
                });
            });
        }).then(function (response) { return res.send(response); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    return AuthController;
}());
var AuthControllerInstance = new AuthController();
exports.default = AuthControllerInstance;
