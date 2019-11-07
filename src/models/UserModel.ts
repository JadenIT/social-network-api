const mongoose = require('mongoose')
import Config from '../config/index'

mongoose.connect(Config.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err: any) => {
    if (err) throw err
})

const userSchema = new mongoose.Schema({
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
        default: 'https://social-network-1601.s3.eu-north-1.amazonaws.com/default.jpg',
        required: true
    },
    subscribers: {
        type: Array
    },
    subscriptions: {
        type: Array
    },
    news: Array,
    messages: {
        type: Array
    }
})
const UserModel = mongoose.model('users', userSchema)

export default UserModel
