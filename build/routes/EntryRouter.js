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
var fs = require('fs');
var EntryController_1 = require("../controllers/EntryController");
var express_1 = require("express");
var storage_1 = require("../middlewares/storage");
var auth_1 = require("../middlewares/auth");
var EntryRouter = (function () {
    function EntryRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    EntryRouter.prototype.createEntry = function (req, res) {
        var _this = this;
        storage_1.default(req, res, function (err) { return __awaiter(_this, void 0, void 0, function () {
            var _a, text, token, file, timestamp, buffer, username;
            return __generator(this, function (_b) {
                if (err)
                    return [2, res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' })];
                _a = req.body, text = _a.text, token = _a.token;
                file = req.files[0] || null;
                timestamp = Date.now();
                if (file)
                    buffer = fs.readFileSync("./uploads/" + file.filename);
                username = req.auth.username;
                EntryController_1.default.create({ username: username, text: text, timestamp: timestamp, token: token, buffer: buffer })
                    .then(function (onResolved) {
                    res.send({ status: 'ok' });
                })
                    .catch(function (error) { return res.send({ status: 'error', error: error }); });
                return [2];
            });
        }); });
    };
    EntryRouter.prototype.Like = function (req, res) {
        var _a = req.body, usernamePostedPostID = _a.usernamePostedPostID, postID = _a.postID;
        var usernameID = req.auth.user_id;
        EntryController_1.default.like(usernameID, usernamePostedPostID, postID)
            .then(function (Response) { return res.send({ status: Response }); })
            .catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    EntryRouter.prototype.Dislike = function (req, res) {
        var _a = req.body, usernamePostedPostID = _a.usernamePostedPostID, postID = _a.postID;
        var usernameID = req.auth.user_id;
        EntryController_1.default.dislike(usernameID, usernamePostedPostID, postID)
            .then(function (response) { return res.send(response); })
            .catch(function (error) { return res.send({ status: 'error', error: error }); });
    };
    EntryRouter.prototype.routes = function () {
        this.router.post('/', auth_1.default, this.createEntry);
        this.router.post('/like', auth_1.default, this.Like);
        this.router.post('/dislike', auth_1.default, this.Dislike);
    };
    return EntryRouter;
}());
var EntryRouterInstance = new EntryRouter();
exports.default = EntryRouterInstance.router;
