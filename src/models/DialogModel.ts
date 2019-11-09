const mongoose = require('mongoose')
import Config from '../config/index'

mongoose.connect(Config.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err: any) => {
    if (err) throw err
})

const DialogSchema = new mongoose.Schema({
    users: Array,
    messages: Array,
    lastVisit: Date
})

const DialogModel = new mongoose.model('dialogs', DialogSchema)

export default DialogModel