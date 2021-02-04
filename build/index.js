Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var server_1 = require("./server");
console.log(process.env.PORT);
server_1.default.listen(process.env.PORT || 8000);
var GoogleCloud_1 = require("./controllers/GoogleCloud");
console.log(GoogleCloud_1.default);
