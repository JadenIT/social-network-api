Object.defineProperty(exports, "__esModule", { value: true });
var Config = (function () {
    function Config() {
        this.CLIENT = process.env.CLIENT;
        this.JWT_KEY = process.env.JWT_KEY;
        this.USER_USERNAME_MIN_LENGTH = process.env.USER_USERNAME_MIN_LENGTH;
        this.USER_FULLNAME_MIN_LENGTH = process.env.USER_FULLNAME_MIN_LENGTH;
        this.USER_PASSWORD_MIN_LENGTH = process.env.USER_PASSWORD_MIN_LENGTH;
        this.MONGO_DB_URI = process.env.MONGO_DB_URI;
        this.AWS_accessKeyId = process.env.AWS_accessKeyId;
        this.AWS_secretAccessKey = process.env.AWS_secretAccessKey;
    }
    return Config;
}());
var ConfigInstance = new Config();
exports.default = ConfigInstance;
