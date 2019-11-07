Object.defineProperty(exports, "__esModule", { value: true });
function cors(req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}
exports.default = cors;
