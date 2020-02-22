import Config from '../config'

const DialogSchema = new Config.MONGOOSE.Schema({
    users: Array,
    messages: Array,
    lastVisit: Date
})

const DialogModel = new Config.MONGOOSE.model('dialogs', DialogSchema)

export default DialogModel