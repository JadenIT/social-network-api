Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var userSchema = new config_1.default.mongoose.Schema({
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
        default: 'https://social-network-1601.s3.eu-north-1.amazonaws.com/default.jpg',
        required: true
    },
    subscribers: {
        type: Array
    },
    subscriptions: {
        type: Array
    },
    favorites: Array,
    messages: {
        type: Array
    }
});
var UserModel = config_1.default.mongoose.model('users', userSchema);
exports.default = UserModel;
