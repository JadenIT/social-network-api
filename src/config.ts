const mongoose = require('mongoose')

class Config {
    CLIENT_URL: any
    JWT_KEY: any
    MONGO_DB_URI: any
    AWS_ACCESS_KEY_ID: any
    AWS_SECRET_KEY: any
    MONGOOSE: any
    AWS_BUCKET: any

    public databaseSetUp() {
        this.MONGOOSE = mongoose
        this.MONGOOSE.connect(this.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err: any) => {
            if (err) console.log('Error while connecting to DB')
        })
    }

    constructor() {
        this.CLIENT_URL = process.env.CLIENT_URL
        this.JWT_KEY = process.env.JWT_KEY
        this.MONGO_DB_URI = process.env.MONGO_DB_URI
        this.AWS_ACCESS_KEY_ID = process.env.AWSAccessKeyId
        this.AWS_SECRET_KEY = process.env.AWSSecretKey
        this.AWS_BUCKET = process.env.AWSBucket
        this.databaseSetUp()
    }
}

const ConfigInstance: Config = new Config()
export default ConfigInstance
