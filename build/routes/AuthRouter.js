"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthController_1 = require("../controllers/AuthController");
var express_1 = require("express");
var jwt = require('jsonwebtoken');
var cookie = require('cookie');
var AuthRouter = (function () {
    function AuthRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    AuthRouter.prototype.Login = function (req, res) {
        var _a = req.body, username = _a.username, password = _a.password;
        AuthController_1.default.isUserIsset(username, password)
            .then(function (onResolved) {
            jwt.sign({ username: username }, process.env.JWT_KEY, function (err, token) {
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    maxAge: 60 * 60 * 24 * 7,
                    path: '/'
                }));
                res.send({ status: 'ok' });
            });
        })
            .catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    AuthRouter.prototype.Authorize = function (req, res) {
        var token = req.cookies.token;
        if (!token)
            return res.send({ isAuthorized: false, token: null });
        jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
            if (err)
                throw err;
            res.send({
                isAuthorized: decoded,
                token: token
            });
        });
    };
    AuthRouter.prototype.routes = function () {
        this.router.post('/login', this.Login);
        this.router.get('/authorize', this.Authorize);
    };
    return AuthRouter;
}());
var AuthRouterInstance = new AuthRouter();
exports.default = AuthRouterInstance.router;
