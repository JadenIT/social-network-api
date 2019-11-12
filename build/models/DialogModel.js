Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var index_1 = require("../config/index");
mongoose.connect(index_1.default.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err)
        throw err;
});
var DialogSchema = new mongoose.Schema({
    users: Array,
    messages: Array,
    lastVisit: Date
});
var DialogModel = new mongoose.model('dialogs', DialogSchema);
exports.default = DialogModel;
