Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require('bcrypt');
var cookie = require('cookie');
var UserModel_1 = require("../models/UserModel");
var AuthController = (function () {
    function AuthController() {
    }
    AuthController.prototype.login = function (username, password) {
        return new Promise(function (resolve, reject) {
            UserModel_1.default.findOne({ username: username }, function (err, doc) {
                if (!doc)
                    return reject('Incorrect username');
                if (err)
                    reject(err);
                bcrypt.compare(password, doc.password, function (err, hash) {
                    if (!hash)
                        return reject('Incorrect password');
                    resolve(doc._id);
                });
            });
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
