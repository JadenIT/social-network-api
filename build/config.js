Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
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
        this.CLIENT_URL = process.env.CLIENT_URL;
        this.databaseSetUp();
    }
    Config.prototype.databaseSetUp = function () {
        this.mongoose = mongoose;
        this.mongoose.connect(this.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
            if (err)
                console.log('Error while connecting to DB');
        });
    };
    return Config;
}());
var ConfigInstance = new Config();
exports.default = ConfigInstance;
