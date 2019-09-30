const userModel = require('../models/userModel')

class userController {
    static usernameIsFree(username, callback) {
        userModel.find({ username: username }, (err, docs) => {
            if (err) throw err
            docs.length > 0 ? callback(false) : callback(true)
        })
    }
    static save(fullname, username, password, callback) {
        const userModelInstance = new userModel({ fullname: fullname, username: username, password: password })
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
}

module.exports = userController