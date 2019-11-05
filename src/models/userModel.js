const mongoose = require('mongoose')
const defaultAvatar = require('./defaultAvatar')

mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
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
        default: defaultAvatar.toString('base64'),
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
