Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cookie = require('cookie');
var UserModel_1 = require("../models/UserModel");
var index_1 = require("../config/index");
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
        try {
            var _a = req.body, fullName_1 = _a.fullName, username_1 = _a.username, password_1 = _a.password;
            if (!username_1)
                return res.send({ status: 'error', error: 'Имя пользователяне заполнено' });
            if (!password_1)
                return res.send({ status: 'error', error: 'Пароль не заполнен' });
            if (!fullName_1)
                return res.send({ status: 'error', error: 'Имя не заполнено' });
            UserController.isUsernameIsFree('username')
                .then(function (isFree) {
                if (!isFree)
                    return res.send({ status: 'error', error: 'Имя занято' });
                bcrypt
                    .hash(password_1, 10)
                    .then(function (hash) {
                    var userModelInstance = new UserModel_1.default({ fullname: fullName_1, username: username_1, password: hash });
                    userModelInstance
                        .save()
                        .then(function (doc) {
                        jwt.sign({ user_id: doc._id, username: username_1 }, index_1.default.JWT_KEY, function (err, token) {
                            res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                                maxAge: 60 * 60 * 24 * 7,
                                path: '/',
                            }));
                            res.send({ status: 'ok' });
                        });
                    })
                        .catch(function (error) { return res.send({ status: 'error', error: error }); });
                })
                    .catch(function (error) { return res.send({ status: 'error', error: error }); });
            })
                .catch(function (error) { return res.send({ status: 'error', error: error }); });
        }
        catch (error) {
            res.send({ status: 'error', error: error });
        }
    };
    UserController.prototype.updateUser = function (req, res) {
        try {
            storage_1.default(req, res, function (err) {
                if (err)
                    return res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' });
                var _a = req.body, oldUsername = _a.oldUsername, newUsername = _a.newUsername, newPassword = _a.newPassword, newAbout = _a.newAbout, newFullname = _a.newFullname;
                var fileURL = req.files[0] ? req.files[0].location : null;
                var query = {};
                if (fileURL)
                    query.avatar = fileURL.toString('base64');
                if (newFullname)
                    query.fullname = newFullname;
                query.about = newAbout;
                if (!newAbout) {
                    query.about = '';
                }
                else {
                    query.about = newAbout;
                }
                if (newUsername) {
                    UserController.isUsernameIsFree(newUsername)
                        .then(function (onResolved) {
                        if (!onResolved)
                            return res.send({ status: 'error', error: 'Имя занято' });
                        query.username = newUsername;
                    })
                        .catch(function (err) { return res.send({ status: 'error', err: err }); });
                }
                if (newPassword) {
                    bcrypt.hash(newPassword, 10).then(function (hash) { return (query.password = hash); }, function (error) { return res.send({ status: 'error', error: error }); });
                }
                console.log(newUsername);
                UserModel_1.default.updateOne({ username: oldUsername }, query)
                    .then(function (onResolved) {
                    jwt.sign({ username: newUsername ? newUsername : oldUsername, user_id: req.auth.user_id }, index_1.default.JWT_KEY, function (err, token) {
                        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                            maxAge: 60 * 60 * 24 * 7,
                            path: '/',
                        }));
                        res.send({ status: 'ok' });
                    });
                })
                    .catch(function (error) { return res.send({ status: 'error', error: error }); });
            });
        }
        catch (error) {
            res.send({ status: 'error', error: error });
        }
    };
    UserController.prototype.getUserByUsername = function (req, res) {
        try {
            var username = req.params.username;
            UserModel_1.default.findOne({ username: username }, {
                _id: 1,
                username: 1,
                fullname: 1,
                posts: 1,
                avatar: 1,
                subscribers: 1,
                subscriptions: 1,
                news: 1,
                about: 1,
            }, function (error, doc) {
                if (error)
                    return res.send({ status: 'error', error: error });
                doc &&
                    doc.posts.sort(function (a, b) {
                        if (a.timestamp > b.timestamp) {
                            return -1;
                        }
                        else {
                            return 1;
                        }
                    });
                res.send({ user: doc });
            });
        }
        catch (error) {
            res.send({ status: 'error', error: error });
        }
    };
    UserController.prototype.getUserIdByUsername = function (username) {
        return new Promise(function (resolve, reject) {
            UserModel_1.default.findOne({ username: username })
                .then(function (res) { return resolve(res._id); })
                .catch(function (err) { return reject('Error'); });
        });
    };
    UserController.prototype.subscribeToUser = function (req, res) {
        try {
            var usernameToSubscribeID_1 = req.body.usernameToSubscribeID;
            var usernameID_1 = req.auth.user_id;
            UserModel_1.default.findOne({ _id: usernameID_1 }, function (error, doc) {
                var subscriptions = doc.subscriptions;
                if (subscriptions.includes(usernameToSubscribeID_1))
                    return res.send({ status: 'error', error: 'Already subscribed' });
                UserModel_1.default.updateOne({ _id: usernameID_1 }, { $push: { subscriptions: usernameToSubscribeID_1 } }, function (error) {
                    if (error)
                        return res.send({ status: 'error', error: error });
                    UserModel_1.default.updateOne({ _id: usernameToSubscribeID_1 }, {
                        $push: {
                            subscribers: usernameID_1,
                        },
                    }, function (error) {
                        if (error)
                            return res.send({ status: 'error', error: error });
                        res.send({ status: 'ok' });
                    });
                });
            });
        }
        catch (error) {
            res.send({ status: 'error', error: error });
        }
    };
    UserController.prototype.unSubscribeFromUser = function (req, res) {
        try {
            var usernameToSubscribeID_2 = req.body.usernameToSubscribeID;
            var usernameID_2 = req.auth.user_id;
            UserModel_1.default.updateOne({ _id: usernameID_2 }, {
                $pull: {
                    subscriptions: usernameToSubscribeID_2,
                },
            }, function (error) {
                if (error)
                    return res.send({ status: 'error', error: error });
                UserModel_1.default.updateOne({ _id: usernameToSubscribeID_2 }, {
                    $pull: {
                        subscribers: usernameID_2,
                    },
                }, function (error) {
                    if (error)
                        throw error;
                    res.send({ status: 'ok' });
                });
            });
        }
        catch (error) {
            res.send({ status: 'error', error: error });
        }
    };
    UserController.prototype.getSubscriptionsByUsername = function (req, res) {
        try {
            var username = req.params.username;
            UserModel_1.default.findOne({ username: username }, { subscriptions: 1, _id: 0 })
                .then(function (result) {
                if (!result)
                    return res.send([]);
                UserModel_1.default.find({ _id: { $in: result.subscriptions } }, { username: 1, avatar: 1, fullname: 1, _id: 0 })
                    .then(function (result) { return res.send({ status: 'ok', subscriptions: result }); })
                    .catch(function (error) { return res.send({ status: 'error', error: error }); });
            })
                .catch(function (error) { return res.send({ status: 'error', error: error }); });
        }
        catch (error) {
            res.send({ status: 'error', error: error });
        }
    };
    UserController.prototype.getSubscribersByUsername = function (req, res) {
        try {
            var username = req.params.username;
            UserModel_1.default.findOne({ username: username }, { subscribers: 1, _id: 0 })
                .then(function (result) {
                if (!result)
                    return res.send([]);
                UserModel_1.default.find({ _id: { $in: result.subscribers } }, { username: 1, avatar: 1, fullname: 1, _id: 0 })
                    .then(function (result) { return res.send({ status: 'ok', subscribers: result }); })
                    .catch(function (error) { return res.send({ status: 'error', error: error }); });
            })
                .catch(function (error) { return res.send({ status: 'error', error: error }); });
        }
        catch (error) {
            res.send({ status: 'error', error: error });
        }
    };
    UserController.prototype.suggestionsByUsername = function (req, res) {
        try {
            var username = req.query.username;
            UserModel_1.default.aggregate([
                {
                    $match: {
                        $and: [{ username: { $not: { $eq: username } } }],
                    },
                },
                {
                    $sort: {
                        subscribers: -1,
                    },
                },
            ], function (error, docs) {
                if (error)
                    return res.send({ status: 'error', error: error });
                if (docs.length === 0)
                    return res.send([]);
                var newArr = [];
                docs.map(function (el, i) {
                    newArr.push({ username: el.username, fullname: el.fullname, avatar: el.avatar });
                    if (i + 1 == docs.length)
                        return res.send({ suggestions: newArr });
                });
            }).limit(10);
        }
        catch (error) {
            res.send({ status: 'error', error: error });
        }
    };
    return UserController;
}());
var UserControllerInstance = new UserController();
exports.default = UserControllerInstance;
