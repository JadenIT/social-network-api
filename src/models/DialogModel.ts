import Config from '../config'

const DialogSchema = new Config.mongoose.Schema({
    users: Array,
    messages: Array,
    lastVisit: Date
})

const DialogModel = new Config.mongoose.model('dialogs', DialogSchema)

export default DialogModel