Object.defineProperty(exports, "__esModule", { value: true });
var Config = (function () {
    function Config() {
        this.CLIENT_URL = process.env.CLIENT_URL;
        this.JWT_KEY = process.env.JWT_KEY;
        this.MONGO_DB_URI = process.env.MONGO_DB_URI;
        this.AWSAccessKeyId = process.env.AWSAccessKeyId;
        this.AWSSecretKey = process.env.AWSSecretKey;
        this.AWSBucket = process.env.AWSBucket;
    }
    return Config;
}());
var ConfigInstance = new Config();
exports.default = ConfigInstance;
