"use strict";
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
var jwt = require('jsonwebtoken');
var uniqid = require('uniqid');
var DialogController = (function () {
    function DialogController() {
    }
    DialogController.prototype.createDialog = function (users, token) {
        return new Promise(function (resolve, reject) {
            jwt.verify(token, process.env.JWT_KEY, function (error, decoded) {
                if (error)
                    return reject(error);
                if (!decoded)
                    return reject('Not authorized');
                UserModel_1.default.findOne({ 'messages.users': { $all: users } })
                    .then(function (response) {
                    if (response)
                        return resolve(response.messages[0].dialogID);
                    var dialogID = uniqid();
                    UserModel_1.default.updateMany({ _id: { $in: users } }, { $push: { messages: { dialogID: dialogID, users: users, messages: [] } } })
                        .then(function (doc) {
                        resolve(dialogID);
                    })
                        .catch(function (error) { return reject(error); });
                })
                    .catch(function (error) { return reject(error); });
            });
        });
    };
    DialogController.prototype.createMessage = function (username, message, roomID, token) {
        return new Promise(function (resolve, reject) {
            jwt.verify(token, process.env.JWT_KEY, function (error, decoded) {
                if (error)
                    return reject(error);
                if (!decoded)
                    return reject('Not authorized');
                if (username != decoded.username)
                    return reject("Token username doesn't match username from req");
                UserModel_1.default.updateMany({ 'messages.dialogID': roomID }, { $push: { 'messages.$.messages': { message: message, username: username, timestamp: Date.now() } } })
                    .then(function (res) {
                    resolve();
                })
                    .catch(function (error) { return reject(error); });
            });
        });
    };
    DialogController.prototype.getMessages = function (username, token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            jwt.verify(token, process.env.JWT_KEY, function (error, decoded) {
                if (error)
                    return reject(error);
                if (!decoded)
                    return reject('Not authorized');
                if (decoded.username != username)
                    return reject("Token username doesn't match username from req");
                UserModel_1.default.findOne({ username: username }, { messages: 1 })
                    .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                    var messages, _loop_1, i, state_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                messages = res.messages;
                                if (messages.length == 0)
                                    return [2, resolve([])];
                                _loop_1 = function (i) {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4, UserModel_1.default.find({ _id: { $in: messages[i].users } }, { username: 1, avatar: 1, _id: 0 })
                                                    .then(function (res) { return (messages[i].users = res); })
                                                    .catch(function (error) { return reject(error); })];
                                            case 1:
                                                _a.sent();
                                                if (i + 1 == messages.length)
                                                    return [2, { value: resolve(messages) }];
                                                return [2];
                                        }
                                    });
                                };
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < messages.length)) return [3, 4];
                                return [5, _loop_1(i)];
                            case 2:
                                state_1 = _a.sent();
                                if (typeof state_1 === "object")
                                    return [2, state_1.value];
                                _a.label = 3;
                            case 3:
                                i++;
                                return [3, 1];
                            case 4: return [2];
                        }
                    });
                }); })
                    .catch(function (error) {
                    reject(error);
                });
            });
        });
    };
    DialogController.prototype.getDialog = function (dialogID, token) {
        var self = this;
        return new Promise(function (resolve, reject) {
            jwt.verify(token, process.env.JWT_KEY, function (error, decoded) {
                if (error)
                    return reject(error);
                if (!decoded)
                    return reject('!decoded');
                UserModel_1.default.findOne({ 'messages.dialogID': dialogID }, { messages: 1, _id: 0 })
                    .then(function (res) {
                    res.messages.map(function (el) {
                        if (el.dialogID == dialogID) {
                            UserModel_1.default.find({ _id: { $in: el.users } }, { avatar: 1, _id: 0, username: 1 }).then(function (res) {
                                el.users_2 = res;
                                return resolve(el);
                            });
                        }
                    });
                })
                    .catch(function (error) { return reject(error); });
            });
        });
    };
    return DialogController;
}());
var DialogControllerInstance = new DialogController();
exports.default = DialogControllerInstance;
