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
var cookie = require('cookie');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var UserModel_1 = require("../models/UserModel");
var config_1 = require("../config");
var AuthController = (function () {
    function AuthController() {
    }
    AuthController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, username, password, user, hash, token, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, username = _a.username, password = _a.password;
                        if (!_.trim(username) || !_.trim(password))
                            return [2, res.send({
                                    status: "Error",
                                    error: 'Не все поля заполнены'
                                })];
                        return [4, UserModel_1.default.findOne({ username: username })];
                    case 1:
                        user = _b.sent();
                        if (!user)
                            return [2, res.send({ status: "Error", error: 'Неправильное имя пользователя' })];
                        return [4, bcrypt.compare(password, user.password)];
                    case 2:
                        hash = _b.sent();
                        if (!hash)
                            return [2, res.send({ status: 'Error', error: 'Неверный пароль' })];
                        token = jwt.sign({ user_id: user._id, username: username }, config_1.default.JWT_KEY);
                        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                            maxAge: 60 * 60 * 24 * 7,
                            domain: process.env.DOMAIN,
                            sameSite: 'strict',
                            path: '/',
                        }));
                        console.log(req.cookies);
                        res.send({ status: 'ok', token: token });
                        return [3, 4];
                    case 3:
                        e_1 = _b.sent();
                        res.send({ status: 'error', e: e_1 });
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    AuthController.prototype.Authorize = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var token, decoded;
            return __generator(this, function (_a) {
                try {
                    token = req.cookies.token;
                    if (!token)
                        return [2, res.send({ isAuthorized: false, token: null })];
                    decoded = jwt.verify(token, config_1.default.JWT_KEY);
                    res.send({
                        isAuthorized: decoded,
                        token: token,
                    });
                }
                catch (e) {
                    res.send({ status: 'error', e: e });
                }
                return [2];
            });
        });
    };
    return AuthController;
}());
var AuthControllerInstance = new AuthController();
exports.default = AuthControllerInstance;
