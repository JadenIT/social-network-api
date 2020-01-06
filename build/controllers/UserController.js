var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cookie = require('cookie');
var _ = require('lodash');
var UserModel_1 = require("../models/UserModel");
var config_1 = require("../config");
var storage_1 = require("../middlewares/storage");
var UserController = (function () {
    function UserController() {
    }
    UserController.isUsernameIsFree = function (username) {
        return new Promise(function (resolve, reject) {
            UserModel_1.default.findOne({ username: username }, function (error, doc) {
                if (error)
                    return reject(error);
                if (doc)
                    return resolve(false);
                resolve(true);
            });
        });
    };
    UserController.prototype.logout = function (req, res) {
        res.setHeader('Set-Cookie', cookie.serialize('token', null, {
            maxAge: 0,
            path: '/',
        }));
        res.send({ status: 'ok' });
    };
    UserController.prototype.createUser = function (req, res) {
        return new Promise(function (resolve, reject) {
            var _a = req.body, fullName = _a.fullName, username = _a.username, password = _a.password;
            if (!_.trim(username) || !_.trim(password) || !_.trim(fullName))
                return res.send({ status: 'error', error: 'Не все поля заполнены' });
            if (_.trim(username).length < 4)
                return reject('Имя пользователя должно содержать более 3 символов');
            if (_.trim(password).length < 4)
                return reject('Пароль должен содержать более 3 символов');
            if (_.trim(fullName).length < 2)
                return reject('Имя и фамилия должны содержать более 1 символа');
            UserController.isUsernameIsFree('username')
                .then(function (isFree) {
                if (!isFree)
                    return reject('Имя занято');
                bcrypt
                    .hash(password, 10)
                    .then(function (hash) {
                    var userModelInstance = new UserModel_1.default({ fullname: fullName, username: username, password: hash });
                    userModelInstance.save().then(function (doc) {
                        jwt.sign({ user_id: doc._id, username: username }, config_1.default.JWT_KEY, function (err, token) {
                            res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                                maxAge: 60 * 60 * 24 * 7,
                                path: '/',
                            }));
                            resolve();
                        });
                    })
                        .catch(function (err) { return reject(err); });
                })
                    .catch(function (err) { return reject(err); });
            })
                .catch(function (err) { return reject(err); });
        }).then(function (response) { return res.send({ status: 'ok' }); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    UserController.prototype.updateUser = function (req, res) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            storage_1.default(req, res, function (err) { return __awaiter(_this, void 0, void 0, function () {
                var _a, oldUsername, newUsername, newPassword, newAbout, newFullname, fileURL, query;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (err)
                                return [2, reject('Произошла ошибка, скорее всего файл слишком большой')];
                            _a = req.body, oldUsername = _a.oldUsername, newUsername = _a.newUsername, newPassword = _a.newPassword, newAbout = _a.newAbout, newFullname = _a.newFullname;
                            fileURL = req.files[0] ? req.files[0].location : null;
                            query = {};
                            if (fileURL)
                                query.avatar = fileURL.toString('base64');
                            if (newFullname) {
                                if (_.trim(newFullname).length < 2)
                                    return [2, reject('Имя и фамилия должны содержать более 1 символа')];
                                query.fullname = newFullname;
                            }
                            !newAbout ? (query.about = '') : (query.about = newAbout);
                            if (!newUsername) return [3, 2];
                            if (_.trim(newUsername).length < 4)
                                return [2, reject('Имя пользователя должно содержать более 3 символов')];
                            return [4, UserController.isUsernameIsFree(newUsername)
                                    .then(function (onResolved) {
                                    if (!onResolved)
                                        return reject('Имя занято');
                                    query.username = newUsername;
                                })
                                    .catch(function (err) { return reject(err); })];
                        case 1:
                            _b.sent();
                            _b.label = 2;
                        case 2:
                            if (!newPassword) return [3, 4];
                            if (_.trim(newPassword).length < 4)
                                return [2, reject('Пароль должен содержать более 3 символов')];
                            return [4, bcrypt.hash(newPassword, 10).then(function (hash) { return (query.password = hash); }, function (error) { return res.send({ status: 'error', error: error }); })];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4:
                            UserModel_1.default.updateOne({ _id: req.auth.user_id }, { $set: query }, function (error, result) {
                                if (error)
                                    return reject(error);
                                jwt.sign({ username: newUsername ? newUsername : oldUsername, user_id: req.auth.user_id }, config_1.default.JWT_KEY, function (err, token) {
                                    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                                        maxAge: 60 * 60 * 24 * 7,
                                        path: '/',
                                    }));
                                    resolve();
                                });
                            });
                            return [2];
                    }
                });
            }); });
        }).then(function (response) { return res.send({ status: 'ok' }); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    UserController.prototype.getUserByUsername = function (req, res) {
        return new Promise(function (resolve, reject) {
            var username = req.params.username;
            UserModel_1.default.findOne({ username: username }, { password: 0 }, function (error, doc) {
                if (error)
                    return reject(error);
                doc &&
                    doc.posts.sort(function (a, b) {
                        if (a.timestamp > b.timestamp) {
                            return -1;
                        }
                        else {
                            return 1;
                        }
                    });
                resolve(doc);
            });
        }).then(function (user) { return res.send({ user: user }); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    UserController.prototype.getUserIdByUsername = function (username) {
        return new Promise(function (resolve, reject) {
            UserModel_1.default.findOne({ username: username })
                .then(function (res) { return resolve(res._id); })
                .catch(function (err) { return reject('Error'); });
        });
    };
    UserController.prototype.subscribeToUser = function (req, res) {
        return new Promise(function (resolve, reject) {
            var usernameToSubscribeID = req.body.usernameToSubscribeID;
            var usernameID = req.auth.user_id;
            UserModel_1.default.findOne({ _id: usernameID }, function (error, doc) {
                var subscriptions = doc.subscriptions;
                if (subscriptions.includes(usernameToSubscribeID))
                    return res.send({ status: 'error', error: 'Already subscribed' });
                UserModel_1.default.updateOne({ _id: usernameID }, { $push: { subscriptions: usernameToSubscribeID } }, function (error) {
                    if (error)
                        return res.send({ status: 'error', error: error });
                    UserModel_1.default.updateOne({ _id: usernameToSubscribeID }, { $push: { subscribers: usernameID, }, }, function (error) {
                        if (error)
                            return reject(error);
                        resolve();
                    });
                });
            });
        }).then(function (response) { return res.send({ status: 'ok' }); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    UserController.prototype.unSubscribeFromUser = function (req, res) {
        return new Promise(function (resolve, reject) {
            var usernameToSubscribeID = req.body.usernameToSubscribeID;
            var usernameID = req.auth.user_id;
            UserModel_1.default.updateOne({ _id: usernameID }, { $pull: { subscriptions: usernameToSubscribeID }, }, function (error) {
                if (error)
                    return reject(error);
                UserModel_1.default.updateOne({ _id: usernameToSubscribeID }, { $pull: { subscribers: usernameID, }, }, function (error) {
                    if (error)
                        return reject(error);
                    resolve();
                });
            });
        }).then(function (response) { return res.send({ status: 'ok' }); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    UserController.prototype.getSubscriptionsByUsername = function (req, res) {
        return new Promise(function (resolve, reject) {
            var username = req.params.username;
            UserModel_1.default.findOne({ username: username }, { subscriptions: 1, _id: 0 }, function (error, doc) {
                if (error)
                    reject(error);
                if (!doc)
                    return resolve([]);
                UserModel_1.default.find({ _id: { $in: doc.subscriptions } }, { username: 1, avatar: 1, fullname: 1, _id: 0 }, function (error, docs) {
                    if (error)
                        reject(error);
                    resolve(docs);
                });
            });
        }).then(function (Arr) { return res.send({ status: 'ok', subscriptions: Arr }); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    UserController.prototype.getSubscribersByUsername = function (req, res) {
        return new Promise(function (resolve, reject) {
            var username = req.params.username;
            UserModel_1.default.findOne({ username: username }, { subscribers: 1, _id: 0 }, function (error, doc) {
                if (!doc)
                    return resolve([]);
                UserModel_1.default.find({ _id: { $in: doc.subscribers } }, { username: 1, avatar: 1, fullname: 1 }, function (error, docs) {
                    if (error)
                        return reject(error);
                    resolve(docs);
                });
            });
        }).then(function (Arr) { return res.send({ subscribers: Arr }); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    UserController.prototype.suggestionsByUsername = function (req, res) {
        return new Promise(function (resolve, reject) {
            var username = req.query.username;
            UserModel_1.default.find({ username: { $not: { $eq: username } } }, function (error, docs) {
                if (error)
                    return reject(error);
                if (docs.length === 0)
                    return resolve([]);
                var newArr = [];
                docs.map(function (el, i) {
                    newArr.push({ username: el.username, fullname: el.fullname, avatar: el.avatar });
                    if (i + 1 == docs.length) {
                        return resolve(newArr.sort(function () { return Math.random() - 0.5; }));
                    }
                });
            }).limit(16);
        }).then(function (Arr) { return res.send({ suggestions: Arr }); }).catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    return UserController;
}());
var UserControllerInstance = new UserController();
exports.default = UserControllerInstance;
