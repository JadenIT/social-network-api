"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookie = require('cookie');
function cookies(req, res, next) {
    req.cookies = cookie.parse(req.headers.cookie || '');
    next();
}
exports.default = cookies;
