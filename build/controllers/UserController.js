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
var UserModel_1 = require("../models/UserModel");
var bcrypt = require('bcrypt');
var UserController = (function () {
    function UserController() {
    }
    UserController.prototype.isUsernameIsFree = function (username) {
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
    UserController.prototype.createUser = function (user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!user.username)
                return reject('Имя пользователя не заполнено');
            if (!user.password)
                return reject('Пароль не заполнен');
            if (!user.fullName)
                return reject('Имя не заполнено');
            _this.isUsernameIsFree(user.username)
                .then(function (isFree) {
                if (!isFree)
                    return reject('Имя занято');
                bcrypt
                    .hash(user.password, 10)
                    .then(function (hash) {
                    var userModelInstance = new UserModel_1.default({ fullname: user.fullName, username: user.username, password: hash });
                    userModelInstance
                        .save()
                        .then(function (doc) { return resolve(doc._id); })
                        .catch(function (error) { return reject(error); });
                })
                    .catch(function (error) { return reject(error); });
            })
                .catch(function (error) { return reject(error); });
        });
    };
    UserController.prototype.updateUser = function (user) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = {};
                        if (user.avatarBuffer)
                            query.avatar = user.avatarBuffer.toString('base64');
                        if (user.newFullName)
                            query.fullname = user.newFullName;
                        query.about = user.newAbout;
                        if (!user.newAbout) {
                            query.about = '';
                        }
                        else {
                            query.about = user.newAbout;
                        }
                        if (!user.newUsername) return [3, 2];
                        return [4, this.isUsernameIsFree(user.newUsername)
                                .then(function (onResolved) {
                                if (!onResolved)
                                    reject('Имя занято');
                                query.username = user.newUsername;
                            })
                                .catch(function (err) { return reject('Произошла ошибка'); })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!user.newPassword) return [3, 4];
                        return [4, bcrypt.hash(user.newPassword, 10).then(function (hash) { return (query.password = hash); }, function (error) { return reject('Произошла ошибка'); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        resolve(query);
                        return [2];
                }
            });
        }); })
            .then(function (query) {
            return new Promise(function (resolve, reject) {
                UserModel_1.default.updateOne({ username: user.oldUsername }, query)
                    .then(function (onResolved) { return resolve(); })
                    .catch(function (error) { return reject('Произошла ошибка'); });
            });
        })
            .catch(function (error) {
            return new Promise(function (resolve, reject) {
                reject(error);
            });
        });
    };
    UserController.prototype.getUserByUsername = function (username) {
        return new Promise(function (resolve, reject) {
            UserModel_1.default.findOne({ username: username }, {
                _id: 1,
                username: 1,
                fullname: 1,
                posts: 1,
                avatar: 1,
                subscribers: 1,
                subscriptions: 1,
                news: 1,
                about: 1
            }, function (error, doc) {
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
        });
    };
    UserController.prototype.getUserIdByUsername = function (username) {
        return new Promise(function (resolve, reject) {
            UserModel_1.default.findOne({ username: username })
                .then(function (res) { return resolve(res._id); })
                .catch(function (err) { return reject('Error'); });
        });
    };
    UserController.prototype.subscribe = function (username_ID, usernameToSubscribe_ID) {
        return new Promise(function (resolve, reject) {
            UserModel_1.default.findOne({ _id: username_ID }, function (error, doc) {
                var subscriptions = doc.subscriptions;
                if (subscriptions.includes(usernameToSubscribe_ID))
                    return reject('Already subscribed');
                UserModel_1.default.updateOne({ _id: username_ID }, {
                    $push: {
                        subscriptions: usernameToSubscribe_ID
                    }
                }, function (error) {
                    if (error)
                        return reject(error);
                    UserModel_1.default.updateOne({ _id: usernameToSubscribe_ID }, {
                        $push: {
                            subscribers: username_ID
                        }
                    }, function (error) {
                        if (error)
                            return reject(error);
                        resolve();
                    });
                });
            });
        });
    };
    UserController.prototype.unSubscribe = function (username_ID, usernameToUnSubscribe_ID) {
        return new Promise(function (resolve, reject) {
            UserModel_1.default.updateOne({ _id: username_ID }, {
                $pull: {
                    subscriptions: usernameToUnSubscribe_ID
                }
            }, function (error) {
                if (error)
                    return reject(error);
                UserModel_1.default.updateOne({ _id: usernameToUnSubscribe_ID }, {
                    $pull: {
                        subscribers: username_ID
                    }
                }, function (error) {
                    if (error)
                        throw error;
                    resolve(true);
                });
            });
        });
    };
    UserController.prototype.getSubscriptionsByUsername = function (username) {
        return new Promise(function (resolve, reject) {
            UserModel_1.default.findOne({ username: username }, { subscriptions: 1, _id: 0 })
                .then(function (res) {
                if (!res)
                    return resolve([]);
                UserModel_1.default.find({ _id: { $in: res.subscriptions } }, { username: 1, avatar: 1, fullname: 1, _id: 0 })
                    .then(function (result) {
                    resolve(result);
                })
                    .catch(function (error) {
                    reject(error);
                });
            })
                .catch(function (error) {
                reject('Error');
            });
        });
    };
    UserController.prototype.suggestionsByUsername = function (username) {
        return new Promise(function (resolve, reject) {
            UserModel_1.default.find({
                $and: [
                    {
                        $or: [{ $where: 'this.subscribers.length >= 0' }, { $where: 'this.posts.length >= 0' }]
                    },
                    { username: { $not: { $eq: username } } }
                ]
            }, function (error, docs) {
                if (error)
                    return reject(error);
                if (docs.length === 0)
                    resolve([]);
                var newArr = [];
                docs.map(function (el, i) {
                    newArr.push({ username: el.username, fullname: el.fullname, avatar: el.avatar });
                    if (i + 1 == docs.length)
                        resolve(newArr);
                });
            }).limit(10);
        });
    };
    return UserController;
}());
var UserControllerInstance = new UserController();
exports.default = UserControllerInstance;
