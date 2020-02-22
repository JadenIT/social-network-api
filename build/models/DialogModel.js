Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var DialogSchema = new config_1.default.MONGOOSE.Schema({
    users: Array,
    messages: Array,
    lastVisit: Date
});
var DialogModel = new config_1.default.MONGOOSE.model('dialogs', DialogSchema);
exports.default = DialogModel;
