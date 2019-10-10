const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/social-network', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) throw err
})

const userSchema = new mongoose.Schema({
    fullname: String,
    username: String,
    password: String,
    posts: Array,
    avatar: String,
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