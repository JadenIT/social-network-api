"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require('jsonwebtoken');
function auth() { }
exports.default = auth;
(function (req, res, next) {
    var token = req.cookies.token;
    if (!token)
        return res.send({ isAuthorized: false, token: null });
    jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
        if (!decoded) {
            res.send({
                status: 'error',
                error: 'Not authorized'
            });
        }
    });
});
