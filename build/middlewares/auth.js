Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require('jsonwebtoken');
var config_1 = require("../config");
var cookie = require('cookie');
function auth(req, res, next) {
    var token = cookie.parse(req.headers.cookie || '').token;
    jwt.verify(token, config_1.default.JWT_KEY, function (err, decoded) {
        if (!decoded)
            return res.send({ status: 'error', error: 'Not authorized' });
        req.auth = {
            user_id: decoded.user_id,
            username: decoded.username
        };
        next();
    });
}
exports.default = auth;
