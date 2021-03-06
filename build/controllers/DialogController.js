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
var ObjectId = require('mongodb').ObjectId;
var UserModel_1 = require("../models/UserModel");
var DialogModel_1 = require("../models/DialogModel");
var DialogController = (function () {
    function DialogController() {
    }
    DialogController.prototype.createDialog = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var users_1, doc, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        users_1 = req.body.users;
                        return [4, users_1.map(function (el) { return ObjectId(el); })];
                    case 1:
                        users_1 = _a.sent();
                        return [4, DialogModel_1.default.findOne({ users: users_1 })];
                    case 2:
                        doc = _a.sent();
                        if (doc)
                            return [2, res.send({ dialogID: doc._id })];
                        return [4, new DialogModel_1.default({
                                users: users_1,
                                messages: [],
                                lastVisit: Date.now(),
                            }).save(function (err, result) { return __awaiter(_this, void 0, void 0, function () {
                                var dialogID;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            dialogID = result._id;
                                            return [4, UserModel_1.default.updateMany({ _id: { $in: users_1 } }, { $push: { messages: dialogID } })];
                                        case 1:
                                            _a.sent();
                                            res.send({ dialogID: dialogID });
                                            return [2];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [3, 5];
                    case 4:
                        e_1 = _a.sent();
                        res.end({ error: e_1 });
                        return [3, 5];
                    case 5: return [2];
                }
            });
        });
    };
    DialogController.prototype.createMessage = function (roomID, message, username) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, DialogModel_1.default.updateOne({ _id: roomID }, {
                                $push: { messages: { message: message, username: username, timestamp: Date.now() }, },
                                $set: { lastVisit: Date.now(), },
                            })];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_2 = _a.sent();
                        console.log('DialogController.createMessage error');
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    DialogController.prototype.getDialogsList = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user_id, query, messages, aggregateParams, dialogs, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user_id = req.auth.user_id;
                        query = req.query.query;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4, UserModel_1.default.findOne({ _id: user_id }, { _id: 0, messages: 1 })];
                    case 2:
                        messages = (_a.sent()).messages;
                        aggregateParams = [
                            { $match: { _id: { $in: messages } } },
                            { $unwind: '$users' },
                            { $match: { users: { $not: { $eq: ObjectId(user_id) } } } },
                            {
                                $lookup: {
                                    from: "users",
                                    localField: "users",
                                    foreignField: '_id',
                                    as: "userInfo"
                                }
                            },
                            { $unwind: '$userInfo' },
                            { $match: { 'userInfo.username': { $regex: query } } },
                            { $unset: ['users', 'messages', 'userInfo.posts', 'userInfo.messages', 'userInfo.password'] },
                            { $sort: { lastVisit: -1 } }
                        ];
                        return [4, DialogModel_1.default.aggregate(aggregateParams)];
                    case 3:
                        dialogs = _a.sent();
                        res.send({ dialogs: dialogs });
                        return [3, 5];
                    case 4:
                        e_3 = _a.sent();
                        res.send({ e: e_3 });
                        return [3, 5];
                    case 5: return [2];
                }
            });
        });
    };
    DialogController.prototype.getDialog = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var dialogID, docs, newObj, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        dialogID = req.query.dialogID;
                        return [4, DialogModel_1.default.findOne({ _id: dialogID }, { messages: 1, _id: 0, users: 1 })];
                    case 1:
                        docs = _b.sent();
                        if (!docs)
                            return [2, res.send({ dialog: [] })];
                        newObj = {
                            messages: docs.messages,
                            users: Array,
                        };
                        _a = newObj;
                        return [4, UserModel_1.default.find({ _id: docs.users })];
                    case 2:
                        _a.users = _b.sent();
                        res.send({ dialog: newObj });
                        return [3, 4];
                    case 3:
                        error_1 = _b.sent();
                        res.send({ error: error_1 });
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    return DialogController;
}());
var DialogControllerInstance = new DialogController();
exports.default = DialogControllerInstance;
