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
var _ = require('lodash');
var uniqid = require('uniqid');
var UserModel_1 = require("../models/UserModel");
var DialogModel_1 = require("../models/DialogModel");
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var DialogController = (function () {
    function DialogController() {
    }
    DialogController.prototype.createDialog = function (users) {
        return new Promise(function (resolve, reject) {
            DialogModel_1.default.findOne({ users: users }, function (err, doc) {
                if (err)
                    throw err;
                if (doc)
                    return resolve(doc._id);
                new DialogModel_1.default({
                    users: users,
                    messages: [],
                    lastVisit: Date.now()
                }).save(function (err, res) {
                    if (err)
                        throw err;
                    var dialogID = res._id;
                    UserModel_1.default.updateMany({ _id: { $in: users } }, { $push: { messages: res._id } }, function (err, res) {
                        if (err)
                            throw err;
                        resolve(dialogID);
                    });
                });
            });
        });
    };
    DialogController.prototype.updateDialogLastVisit = function (dialogID, date) {
        return new Promise(function (resolve, reject) {
            DialogModel_1.default.updateOne({ _id: dialogID }, { $set: { lastVisit: date } }, function (err, res) {
                if (err)
                    reject(err);
                resolve();
            });
        });
    };
    DialogController.prototype.createMessage = function (username, message, roomID) {
        var self = this;
        return new Promise(function (resolve, reject) {
            DialogModel_1.default.updateOne({ _id: roomID }, { $push: { messages: { message: message, username: username, timestamp: Date.now() } } }, function (err, res) {
                if (err)
                    throw err;
                self.updateDialogLastVisit(roomID, Date.now())
                    .then(function (res) { return resolve(); })
                    .catch(function (err) { return reject(err); });
            });
        });
    };
    DialogController.prototype.getMessages = function (username, query) {
        return new Promise(function (resolve, reject) {
            UserModel_1.default.findOne({ username: username }, { _id: 0 }, function (err, doc) {
                if (err)
                    throw err;
                if (doc.messages.length == 0)
                    return resolve([]);
                DialogModel_1.default.aggregate([{ $match: { _id: { $in: doc.messages } } }, { $unset: ['messages', '__v'] }], function (err, docs) {
                    return __awaiter(this, void 0, void 0, function () {
                        var newArr;
                        var _this = this;
                        return __generator(this, function (_a) {
                            if (err)
                                throw err;
                            newArr = [];
                            docs.map(function (el, i) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            el.users = el.users.map(function (el) { return ObjectId(el); });
                                            return [4, UserModel_1.default.aggregate([
                                                    { $match: { $and: [{ _id: { $in: el.users } }, { username: { $not: { $eq: username } } }] } },
                                                    { $unset: ['posts', 'about', 'subscribers', 'subscriptions', 'news', 'fullname', 'password', 'messages', '_id', '__v'] },
                                                    { $match: { username: { $regex: query, $options: 'g' } } },
                                                    { $set: { lastVisit: el.lastVisit, dialogID: el._id } },
                                                    { $sort: { lastVisit: 1 } }
                                                ], function (err, docs) {
                                                    if (err)
                                                        throw err;
                                                    newArr = newArr.concat(docs);
                                                })];
                                        case 1:
                                            _a.sent();
                                            if (i + 1 == docs.length)
                                                return [2, resolve(newArr)];
                                            return [2];
                                    }
                                });
                            }); });
                            return [2];
                        });
                    });
                });
            });
        });
    };
    DialogController.prototype.getDialog = function (dialogID) {
        return new Promise(function (resolve, reject) {
            DialogModel_1.default.findOne({ _id: dialogID }, { messages: 1, _id: 0, users: 1 }, function (err, res) {
                if (err)
                    throw err;
                if (!res)
                    return resolve([]);
                res.users = res.users.map(function (el) { return ObjectId(el); });
                UserModel_1.default.aggregate([
                    {
                        $match: { _id: { $in: res.users } }
                    },
                    {
                        $unset: ['posts', 'about', 'subscribers', 'subscriptions', 'news', 'fullname', 'password', 'messages', '_id', '__v']
                    }
                ], function (err, docs) {
                    res.users = docs;
                    resolve(res);
                });
            });
        });
    };
    return DialogController;
}());
var DialogControllerInstance = new DialogController();
exports.default = DialogControllerInstance;
