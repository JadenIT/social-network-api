Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require('bcrypt');
var cookie = require('cookie');
var UserModel_1 = require("../models/UserModel");
var jwt = require('jsonwebtoken');
var index_1 = require("../config/index");
var AuthController = (function () {
    function AuthController() {
    }
    AuthController.prototype.login = function (req, res) {
        try {
            var _a = req.body, username_1 = _a.username, password_1 = _a.password;
            UserModel_1.default.findOne({ username: username_1 }, function (err, doc) {
                if (!doc)
                    return res.send({ status: 'error', error: 'Incorrect username' });
                if (err)
                    return res.send({ status: 'error', error: err });
                bcrypt.compare(password_1, doc.password, function (err, hash) {
                    if (!hash)
                        return res.send({ status: 'error', error: 'Incorrect password' });
                    jwt.sign({ user_id: doc._id, username: username_1 }, index_1.default.JWT_KEY, function (err, token) {
                        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                            maxAge: 60 * 60 * 24 * 7,
                            path: '/',
                        }));
                        res.send({ status: 'ok' });
                    });
                });
            });
        }
        catch (e) {
            res.send({ status: 'error', error: e });
        }
    };
    AuthController.prototype.Authorize = function (req, res) {
        try {
            var token_1 = req.cookies.token;
            if (!token_1)
                return res.send({ isAuthorized: false, token: null });
            jwt.verify(token_1, index_1.default.JWT_KEY, function (err, decoded) {
                if (err)
                    throw err;
                res.send({
                    isAuthorized: decoded,
                    token: token_1,
                });
            });
        }
        catch (e) {
            res.send({ status: 'error', error: e });
        }
    };
    return AuthController;
}());
var AuthControllerInstance = new AuthController();
exports.default = AuthControllerInstance;
