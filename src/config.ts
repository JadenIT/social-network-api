const mongoose = require('mongoose')

class Config {
    CLIENT: any
    JWT_KEY: any
    MONGO_DB_URI: any
    AWS_accessKeyId: any
    AWS_secretAccessKey: any
    CLIENT_URL: any
    mongoose: any

    public databaseSetUp() {
        this.mongoose = mongoose
        this.mongoose.connect(this.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err: any) => {
            if (err) console.log('Error while connecting to DB')
        })
    }

    constructor() {
        this.CLIENT = process.env.CLIENT
        this.JWT_KEY = process.env.JWT_KEY
        this.MONGO_DB_URI = process.env.MONGO_DB_URI
        this.AWS_accessKeyId = process.env.AWS_accessKeyId
        this.AWS_secretAccessKey = process.env.AWS_secretAccessKey
        this.CLIENT_URL = process.env.CLIENT_URL
        this.databaseSetUp()
    }
}

const ConfigInstance: Config = new Config()
export default ConfigInstance
