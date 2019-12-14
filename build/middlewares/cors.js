Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
function cors(req, res, next) {
    res.header('Access-Control-Allow-Origin', config_1.default.CLIENT_URL);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}
exports.default = cors;
