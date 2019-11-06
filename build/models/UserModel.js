"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var defaultAvatar_1 = require("./defaultAvatar");
var index_1 = require("../config/index");
mongoose.connect(index_1.default.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err)
        throw err;
});
var userSchema = new mongoose.Schema({
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
        default: defaultAvatar_1.default.toString('base64'),
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
});
var UserModel = mongoose.model('users', userSchema);
exports.default = UserModel;
