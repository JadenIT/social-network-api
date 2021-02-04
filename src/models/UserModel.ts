import Config from '../config'

const userSchema = new Config.mongoose.Schema({
    about: {
        type: String,
        default: null
    },
    fullname: {
        type: String,
        required: [true, 'Fullname is required']
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: Array,
    avatar: {
        type: String,
        default: '230-2301779_best-classified-apps-default-user-profile.png',
        required: true
    },
    subscribers: {
        type: Array
    },
    subscriptions: {
        type: Array
    },
    favorites: Array,
    messages: {
        type: Array
    }
})
const UserModel = Config.mongoose.model('users', userSchema)

export default UserModel
