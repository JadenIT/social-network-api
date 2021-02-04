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
var ObjectId = require('mongodb').ObjectId;
var UserModel_1 = require("../models/UserModel");
var config_1 = require("../config");
var GoogleCloud_1 = require("./GoogleCloud");
var UserController = (function () {
    function UserController() {
    }
    UserController.isUsernameIsFree = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var isFree, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, UserModel_1.default.findOne({ username: username })];
                    case 1:
                        isFree = _a.sent();
                        if (isFree) {
                            return [2, false];
                        }
                        return [2, true];
                    case 2:
                        e_1 = _a.sent();
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    UserController.prototype.logout = function (req, res) {
        res.setHeader('Set-Cookie', cookie.serialize('token', null, {
            maxAge: 0,
            path: '/',
            domain: 'vladislavkruglikov.com',
            sameSite: 'strict',
        }));
        res.send({ status: 'ok' });
    };
    UserController.prototype.createUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, fullName, username, password, isUsernameFree, hash, userModelInstance, doc, token, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.body, fullName = _a.fullName, username = _a.username, password = _a.password;
                        if (!_.trim(username) || !_.trim(password) || !_.trim(fullName))
                            return [2, res.send({
                                    status: 'error',
                                    error: 'Не все поля заполнены'
                                })];
                        if (_.trim(username).length < 4)
                            return [2, res.send({
                                    status: 'error',
                                    error: 'Имя пользователя должно содержать более 3 символов'
                                })];
                        if (_.trim(password).length < 4)
                            return [2, res.send({
                                    status: 'error',
                                    error: 'Пароль должен содержать более 3 символов'
                                })];
                        if (_.trim(fullName).length < 2)
                            return [2, res.send({
                                    status: 'error',
                                    error: 'Имя и фамилия должны содержать более 1 символа'
                                })];
                        return [4, UserController.isUsernameIsFree(username)];
                    case 1:
                        isUsernameFree = _b.sent();
                        if (!isUsernameFree)
                            return [2, res.send({ status: 'error', error: 'Имя занято' })];
                        return [4, bcrypt.hash(password, 10)];
                    case 2:
                        hash = _b.sent();
                        userModelInstance = new UserModel_1.default({ fullname: fullName, username: username, password: hash });
                        return [4, userModelInstance.save()];
                    case 3:
                        doc = _b.sent();
                        token = jwt.sign({ user_id: doc._id, username: username }, config_1.default.JWT_KEY);
                        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                            maxAge: 60 * 60 * 24 * 7,
                            path: '/',
                        }));
                        res.send({ status: 'ok' });
                        return [3, 5];
                    case 4:
                        e_2 = _b.sent();
                        console.log(e_2);
                        res.send({ status: 'error', e: e_2 });
                        return [3, 5];
                    case 5: return [2];
                }
            });
        });
    };
    UserController.prototype.updateUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, oldUsername, newUsername, newPassword, newAbout, newFullname, query, time, isUsernameFree, _b, token, e_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        _a = req.body, oldUsername = _a.oldUsername, newUsername = _a.newUsername, newPassword = _a.newPassword, newAbout = _a.newAbout, newFullname = _a.newFullname;
                        query = {};
                        if (req.files['newAvatar']) {
                            time = new Date().getTime();
                            query.avatar = time.toString() + req.files['newAvatar']['name'];
                            GoogleCloud_1.saveFile(req.files['newAvatar']['data'], query.avatar);
                        }
                        if (newFullname) {
                            if (_.trim(newFullname).length < 2)
                                return [2, res.send({
                                        status: "Error",
                                        error: 'Имя и фамилия должны содержать более 1 символа'
                                    })];
                            query.fullname = newFullname;
                        }
                        !newAbout ? (query.about = '') : (query.about = newAbout);
                        if (!newUsername) return [3, 2];
                        if (_.trim(newUsername).length < 4)
                            return [2, res.send({
                                    status: 'Error',
                                    error: 'Имя пользователя должно содержать более 3 символов'
                                })];
                        return [4, UserController.isUsernameIsFree(newUsername)];
                    case 1:
                        isUsernameFree = _c.sent();
                        if (!isUsernameFree)
                            return [2, res.send({ status: "Error", error: 'Имя занято' })];
                        query.username = newUsername;
                        _c.label = 2;
                    case 2:
                        if (!newPassword) return [3, 4];
                        if (_.trim(newPassword).length < 4)
                            return [2, res.send({
                                    status: "Error",
                                    error: 'Пароль должен содержать более 3 символов'
                                })];
                        _b = query;
                        return [4, bcrypt.hash(newPassword, 10)];
                    case 3:
                        _b.password = _c.sent();
                        _c.label = 4;
                    case 4: return [4, UserModel_1.default.updateOne({ _id: req.auth.user_id }, { $set: query })];
                    case 5:
                        _c.sent();
                        token = jwt.sign({
                            username: newUsername ? newUsername : oldUsername,
                            user_id: req.auth.user_id
                        }, config_1.default.JWT_KEY);
                        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                            maxAge: 60 * 60 * 24 * 7,
                            path: '/',
                        }));
                        res.send({ status: 'ok' });
                        return [3, 7];
                    case 6:
                        e_3 = _c.sent();
                        res.send({ status: 'Error' });
                        return [3, 7];
                    case 7: return [2];
                }
            });
        });
    };
    UserController.prototype.getUserByUsername = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var username, doc, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        username = req.params.username;
                        return [4, UserModel_1.default.findOne({ username: username }, { password: 0 })];
                    case 1:
                        doc = _a.sent();
                        doc && doc.posts.sort(function (a, b) {
                            if (a.timestamp > b.timestamp) {
                                return -1;
                            }
                            else {
                                return 1;
                            }
                        });
                        res.send({ user: doc });
                        return [3, 3];
                    case 2:
                        e_4 = _a.sent();
                        res.send({ status: 'Error' });
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    UserController.prototype.getUserIdByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var _id, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, UserModel_1.default.findOne({ username: username })];
                    case 1:
                        _id = (_a.sent())._id;
                        return [2, _id];
                    case 2:
                        e_5 = _a.sent();
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    UserController.prototype.subscribeToUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user_id, usernameID, subscriptions, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        user_id = req.body.user_id;
                        usernameID = req.auth.user_id;
                        return [4, UserModel_1.default.findOne({ _id: usernameID })];
                    case 1:
                        subscriptions = (_a.sent()).subscriptions;
                        if (subscriptions.includes(user_id))
                            return [2, res.send({ status: 'error', error: 'Already subscribed' })];
                        return [4, UserModel_1.default.updateOne({ _id: usernameID }, { $push: { subscriptions: ObjectId(user_id) } })];
                    case 2:
                        _a.sent();
                        return [4, UserModel_1.default.updateOne({ _id: user_id }, { $push: { subscribers: ObjectId(usernameID), } })];
                    case 3:
                        _a.sent();
                        res.send({ status: 'ok' });
                        return [3, 5];
                    case 4:
                        e_6 = _a.sent();
                        res.send({ status: 'Error' });
                        return [3, 5];
                    case 5: return [2];
                }
            });
        });
    };
    UserController.prototype.unSubscribeFromUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user_id, usernameID, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        user_id = req.body.user_id;
                        usernameID = req.auth.user_id;
                        return [4, UserModel_1.default.updateOne({ _id: usernameID }, { $pull: { subscriptions: user_id }, })];
                    case 1:
                        _a.sent();
                        return [4, UserModel_1.default.updateOne({ _id: user_id }, { $pull: { subscribers: usernameID, }, })];
                    case 2:
                        _a.sent();
                        res.send({ status: 'ok' });
                        return [3, 4];
                    case 3:
                        e_7 = _a.sent();
                        res.send({ status: 'Error' });
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    UserController.prototype.getSubscriptionsByUsername = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var username, doc, docs, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        username = req.params.username;
                        return [4, UserModel_1.default.findOne({ username: username }, { subscriptions: 1, _id: 0 })];
                    case 1:
                        doc = _a.sent();
                        if (!doc)
                            return [2, res.send({ subscriptions: [] })];
                        return [4, UserModel_1.default.find({ _id: { $in: doc.subscriptions } }, {
                                username: 1,
                                avatar: 1,
                                fullname: 1,
                                _id: 0
                            })];
                    case 2:
                        docs = _a.sent();
                        res.send({ subscriptions: docs });
                        return [3, 4];
                    case 3:
                        e_8 = _a.sent();
                        res.send({ status: 'Error' });
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    UserController.prototype.getSubscribersByUsername = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var username, doc, docs, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        username = req.params.username;
                        return [4, UserModel_1.default.findOne({ username: username }, { subscribers: 1, _id: 0 })];
                    case 1:
                        doc = _a.sent();
                        if (!doc)
                            return [2, res.send({ subscribers: [] })];
                        return [4, UserModel_1.default.find({ _id: { $in: doc.subscribers } }, {
                                username: 1,
                                avatar: 1,
                                fullname: 1
                            })];
                    case 2:
                        docs = _a.sent();
                        res.send({ subscribers: docs });
                        return [3, 4];
                    case 3:
                        e_9 = _a.sent();
                        res.send({ status: 'Error' });
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    UserController.prototype.suggestionsByUsername = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var username, docs_1, newArr_1, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        username = req.query.username;
                        return [4, UserModel_1.default.find({ username: { $not: { $eq: username } } }).limit(16)];
                    case 1:
                        docs_1 = _a.sent();
                        if (docs_1.length === 0)
                            return [2, res.send({ suggestions: [] })];
                        newArr_1 = [];
                        docs_1.map(function (el, i) {
                            newArr_1.push({ username: el.username, fullname: el.fullname, avatar: el.avatar });
                            if (i + 1 == docs_1.length) {
                                return res.send({ suggestions: newArr_1.sort(function () { return Math.random() - 0.5; }) });
                            }
                        });
                        return [3, 3];
                    case 2:
                        e_10 = _a.sent();
                        res.send({ status: 'Error' });
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    return UserController;
}());
var UserControllerInstance = new UserController();
exports.default = UserControllerInstance;
