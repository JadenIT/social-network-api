class Config {
    CLIENT_URL: any
    JWT_KEY: any
    MONGO_DB_URI: any
    AWSAccessKeyId: any
    AWSSecretKey: any
    AWSBucket: any

    constructor() {
        this.CLIENT_URL = process.env.CLIENT_URL
        this.JWT_KEY = process.env.JWT_KEY
        this.MONGO_DB_URI = process.env.MONGO_DB_URI
        this.AWSAccessKeyId = process.env.AWSAccessKeyId
        this.AWSSecretKey = process.env.AWSSecretKey
        this.AWSBucket = process.env.AWSBucket
    }
}

const ConfigInstance: Config = new Config()
export default ConfigInstance
