"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var http = require('http');
var server_1 = require("./server");
var socket_1 = require("./socket");
var server = http.createServer(server_1.default.app);
new socket_1.default(server);
server.listen(8000);
