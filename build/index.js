Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var server_1 = require("./server");
server_1.default.listen(process.env.PORT || 8000);
