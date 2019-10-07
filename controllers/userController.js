const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
var uniqid = require('uniqid');

class userController {
    static usernameIsFree(username, callback) {
        userModel.find({ username: username }, (err, docs) => {
            if (err) throw err
            docs.length > 0 ? callback(false) : callback(true)
        })
    }
    static save(fullname, username, password, avatar, callback) {
        const userModelInstance = new userModel({
            fullname: fullname,
            username: username,
            password: password,
            avatar: avatar
        })
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
    static savePost(username, filename, text, avatar, timestamp, callback) {
        userModel.updateOne({ username: username },
            {
                $push: {
                    posts: {
                        id: uniqid(),
                        filename: filename,
                        text: text,
                        likes: 0,
                        username: username,
                        avatar: avatar,
                        timestamp: timestamp
                    }
                }
            }, function (err) {
                callback(err)
            })
    }

    static async removePost(username, postID, callback) {
        const up = await userModel.updateOne({ username: username }, { $pull: { posts: { id: postID } } })
        up.nModified == 1 ? callback(true) : callback(false)
    }

    static getNewsByUsername(username, callback) {
        userModel.findOne({ username: username }, { subscriptions: 1 }, function (err, doc) {
            if (err) throw err
            const { subscriptions } = doc || []
            userController.getNewsByArrOfSUbscriptions(subscriptions, (response) => {
                callback({ news: response })
            })
        })
    }

    static getPublicUser(username, callback) {
        userModel.findOne({ username: username }, {
            username: 1,
            fullname: 1,
            posts: 1,
            avatar: 1,
            subscribers: 1,
            subscriptions: 1,
            news: 1
        }, function (err, doc) {
            if (err) throw err
            callback(doc)
        })
    }

    static getNewsByArrOfSUbscriptions(arr, callback) {
        let newsArr = []
        if (arr) {
            arr.map((el, i) => {
                userModel.findOne({ username: el.username }, { posts: 1 }, function (err, response) {
                    newsArr = newsArr.concat(response.posts)
                    if (i + 1 == arr.length) {
                        callback(newsArr)
                    }
                })
            })
        }
        else {
            callback([])
        }
    }

    static subscribe(username, usernameToSubscribe, callback) {
        userModel.findOne({ username: username }, function (err, doc) {
            const { subscriptions } = doc
            if (subscriptions.some(el => el.username == usernameToSubscribe)) {
                callback(false)
            }
            else {
                userModel.updateOne({ username: username }, {
                    $push: {
                        subscriptions: {
                            username: usernameToSubscribe
                        }
                    }
                }, function (err) {
                    if (err) throw err
                    userModel.updateOne({ username: usernameToSubscribe }, {
                        $push: {
                            subscribers: {
                                username: username
                            }
                        }
                    }, function (err) {
                        if (err) throw err
                        callback(true)
                    })
                })
            }
        })
    }

    static unSubscribe(username, usernameToUnSubscribe, callback) {
        userModel.updateOne({ username: username }, {
            $pull: {
                subscriptions: {
                    username: usernameToUnSubscribe
                }
            }
        }, function (err) {
            if (err) throw err
            userModel.updateOne({ username: usernameToUnSubscribe }, {
                $pull: {
                    subscribers: {
                        username: username
                    }
                }
            }, function (err) {
                if (err) throw err
                callback(true)
            })
        })
    }

}

module.exports = userController