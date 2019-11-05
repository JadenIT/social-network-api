"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require('bcrypt');
var UserModel_1 = require("../models/UserModel");
var AuthController = (function () {
    function AuthController() {
    }
    AuthController.prototype.isUserIsset = function (username, password) {
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
                    if (hash) {
                        resolve();
                    }
                })
                    .catch(function (error) { return reject(error); });
            })
                .catch(function (error) { return reject(error); });
        });
    };
    return AuthController;
}());
var AuthControllerInstance = new AuthController();
exports.default = AuthControllerInstance;
