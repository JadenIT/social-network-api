class Config {
    CLIENT: any
    JWT_KEY: any
    USER_USERNAME_MIN_LENGTH: any
    USER_FULLNAME_MIN_LENGTH: any
    USER_PASSWORD_MIN_LENGTH: any
    MONGO_DB_URI: any
    AWS_accessKeyId: any
    AWS_secretAccessKey: any

    constructor() {
        this.CLIENT = process.env.CLIENT
        this.JWT_KEY = process.env.JWT_KEY
        this.USER_USERNAME_MIN_LENGTH = process.env.USER_USERNAME_MIN_LENGTH
        this.USER_FULLNAME_MIN_LENGTH = process.env.USER_FULLNAME_MIN_LENGTH
        this.USER_PASSWORD_MIN_LENGTH = process.env.USER_PASSWORD_MIN_LENGTH
        this.MONGO_DB_URI = process.env.MONGO_DB_URI
        this.AWS_accessKeyId = process.env.AWS_accessKeyId
        this.AWS_secretAccessKey = process.env.AWS_secretAccessKey
    }
}

const ConfigInstance: Config = new Config()
export default ConfigInstance
