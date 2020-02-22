Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Config = (function () {
    function Config() {
        this.CLIENT_URL = process.env.CLIENT_URL;
        this.JWT_KEY = process.env.JWT_KEY;
        this.MONGO_DB_URI = process.env.MONGO_DB_URI;
        this.AWS_ACCESS_KEY_ID = process.env.AWSAccessKeyId;
        this.AWS_SECRET_KEY = process.env.AWSSecretKey;
        this.AWS_BUCKET = process.env.AWSBucket;
        this.databaseSetUp();
    }
    Config.prototype.databaseSetUp = function () {
        this.MONGOOSE = mongoose;
        this.MONGOOSE.connect(this.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
            if (err)
                console.log('Error while connecting to DB');
        });
    };
    return Config;
}());
var ConfigInstance = new Config();
exports.default = ConfigInstance;
