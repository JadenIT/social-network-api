class Config {
    CLIENT
    JWT_KEY
    USER_USERNAME_MIN_LENGTH
    USER_FULLNAME_MIN_LENGTH
    USER_PASSWORD_MIN_LENGTH
    MONGO_DB_URI

    constructor() {
        this.CLIENT = process.env.CLIENT
        this.JWT_KEY = process.env.JWT_KEY
        this.USER_USERNAME_MIN_LENGTH = process.env.USER_USERNAME_MIN_LENGTH
        this.USER_FULLNAME_MIN_LENGTH = process.env.USER_FULLNAME_MIN_LENGTH
        this.USER_PASSWORD_MIN_LENGTH = process.env.USER_PASSWORD_MIN_LENGTH
        this.MONGO_DB_URI = process.env.MONGO_DB_URI
    }
}

const ConfigInstance: Config = new Config()
export default ConfigInstance
