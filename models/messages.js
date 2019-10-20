const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
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