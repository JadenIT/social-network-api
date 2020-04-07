const mongoose = require('mongoose')

class Config {
    public CLIENT_URL: any;
    public JWT_KEY: any;
    public MONGO_DB_URI: any;
    public AWS_ACCESS_KEY_ID: any;
    public AWS_SECRET_KEY: any;
    public AWS_BUCKET: any;

    public mongoose: any;

    public databaseSetUp() {
        this.mongoose = mongoose;
        this.mongoose.connect(this.MONGO_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (err: any) => {
            if (err) console.log('Error while connecting to DB');
        })
    }

    constructor() {
        this.CLIENT_URL = process.env.CLIENT_URL;
        this.JWT_KEY = process.env.JWT_KEY;
        this.MONGO_DB_URI = process.env.MONGO_DB_URI;
        this.AWS_ACCESS_KEY_ID = process.env.AWSAccessKeyId;
        this.AWS_SECRET_KEY = process.env.AWSSecretKey;
        this.AWS_BUCKET = process.env.AWSBucket;
        this.databaseSetUp();
    }
}

const ConfigInstance: Config = new Config();

export default ConfigInstance;
