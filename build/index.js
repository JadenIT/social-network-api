"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var server_1 = require("./server");
server_1.default.app.listen(4000, function () { return console.log('1'); });
