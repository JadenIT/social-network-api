const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')

class userController {
    static usernameIsFree(username, callback) {
        userModel.find({ username: username }, (err, docs) => {
            if (err) throw err
            docs.length > 0 ? callback(false) : callback(true)
        })
    }
    static save(fullname, username, password, avatar, callback) {
        const userModelInstance = new userModel({ fullname: fullname, username: username, password: password, avatar: avatar })
        userModelInstance.save((err) => {
            callback(err)
        })
    }

    static login(username, password, callback) {
        userModel.findOne({ username: username, password: password }, function (err, doc) {
            if (err) throw err
            doc ? callback(true) : callback(false)
        })
    }

    static isAuthorized(token, callback) {
        try {
            jwt.verify(token, 'Some key', (err, decoded) => {
                decoded == null || decoded == undefined ? callback(false) : callback(true)
            })
        }
        catch (err) {
            throw err
        }
    }
    static savePost(username, filename, text, avatar, callback) {
        userModel.updateOne({ username: username },
            { $push: { posts: { filename: filename, text: text, likes: 0, username: username, avatar: avatar } } }, function (err) {
                callback(err)
            })
    }

    static getPublicUser(username, callback) {
        userModel.findOne({ username: username }, { username: 1, fullname: 1, posts: 1, avatar: 1 }, function (err, doc) {
            if (err) throw err
            callback(doc)
        })
    }
}

module.exports = userController