Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require('jsonwebtoken');
var AuthController_1 = require("../controllers/AuthController");
var express_1 = require("express");
var index_1 = require("../config/index");
var AuthRouter = (function () {
    function AuthRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    AuthRouter.prototype.Login = function (req, res) {
        var _a = req.body, username = _a.username, password = _a.password;
        AuthController_1.default.login(username, password)
            .then(function (user_id) {
            jwt.sign({ user_id: user_id, username: username }, index_1.default.JWT_KEY, function (err, token) {
                AuthController_1.default.setCookie(res, 'token', token, 60 * 60 * 24 * 7);
                res.send({ status: 'ok' });
            });
        })
            .catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    AuthRouter.prototype.Authorize = function (req, res) {
        var token = req.cookies.token;
        if (!token)
            return res.send({ isAuthorized: false, token: null });
        jwt.verify(token, index_1.default.JWT_KEY, function (err, decoded) {
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
