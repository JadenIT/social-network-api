"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var UserRouter_1 = require("./routes/UserRouter");
var EntryRouter_1 = require("./routes/EntryRouter");
var SearchRouter_1 = require("./routes/SearchRouter");
var AuthRouter_1 = require("./routes/AuthRouter");
var DialogRouter_1 = require("./routes/DialogRouter");
var NewsRouter_1 = require("./routes/NewsRouter");
var cookies_1 = require("./middlewares/cookies");
var cors_1 = require("./middlewares/cors");
var Server = (function () {
    function Server() {
        this.app = express();
        this.config();
        this.routes();
    }
    Server.prototype.config = function () {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cors_1.default);
        this.app.use(express.static(__dirname));
        this.app.use(cookies_1.default);
    };
    Server.prototype.routes = function () {
        this.app.use('/user', UserRouter_1.default);
        this.app.use('/entry', EntryRouter_1.default);
        this.app.use('/search', SearchRouter_1.default);
        this.app.use('/auth', AuthRouter_1.default);
        this.app.use('/messenger', DialogRouter_1.default);
        this.app.use('/news', NewsRouter_1.default);
    };
    return Server;
}());
var ServerInstance = new Server();
exports.default = ServerInstance;
