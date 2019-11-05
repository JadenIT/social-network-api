"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookie = require('cookie');
function default_1(req, res, next) {
    req.cookies = cookie.parse(req.headers.cookie || '');
    next();
}
exports.default = default_1;
