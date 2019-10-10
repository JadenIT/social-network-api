const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/social-network', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) throw err
})

const messagesSchema = new mongoose.Schema({
    id: String,
    users: {
        type: Array
    },
    messages: {
        type: Array
    }
})
const messagesModel = mongoose.model('messages', messagesSchema)

module.exports = messagesModel