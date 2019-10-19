const mongoose = require('mongoose')

const { USER_USERNAME_MIN_LENGTH, USER_FULLNAME_MIN_LENGTH, USER_PASSWORD_MIN_LENGTH } = process.env

mongoose.connect('mongodb://localhost:27017/social-network', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
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
        default: 'defaultLogo.png',
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
const userModel = mongoose.model('users', userSchema)

module.exports = userModel