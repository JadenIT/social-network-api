"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require('bcrypt');
var cookie = require('cookie');
var UserModel_1 = require("../models/UserModel");
var AuthController = (function () {
    function AuthController() {
    }
    AuthController.prototype.login = function (username, password) {
        return new Promise(function (resolve, reject) {
            UserModel_1.default.findOne({ username: username })
                .then(function (doc) {
                if (!doc)
                    return reject('Incorrect username');
                bcrypt
                    .compare(password, doc.password)
                    .then(function (hash) {
                    if (!hash)
                        return reject('Incorrect password');
                    resolve(doc._id);
                })
                    .catch(function (error) { return reject(error); });
            })
                .catch(function (error) { return reject(error); });
        });
    };
    AuthController.prototype.setCookie = function (res, field, value, maxAge) {
        res.setHeader('Set-Cookie', cookie.serialize(field, value, {
            maxAge: maxAge,
            path: '/'
        }));
    };
    return AuthController;
}());
var AuthControllerInstance = new AuthController();
exports.default = AuthControllerInstance;
