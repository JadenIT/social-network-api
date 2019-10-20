const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
var uniqid = require('uniqid');
const messageModel = require('../models/messages')
const bcrypt = require('bcrypt')

class userController {

    static usernameIsFree(username) {
        return new Promise((resolve, reject) => {
            userModel.find({ username }, (error, docs) => {
                if (error) return reject(error)
                if (docs.length > 0) resolve(false)
                else resolve(true)
            })
        })
    }

    static save(fullname, username, password) {
        return new Promise((resolve, reject) => {
            this.usernameIsFree(username).then(isFree => {
                if (!isFree) return reject('Имя занято')
                bcrypt.hash(password, 10).then(hash => {
                    const userModelInstance = new userModel({ fullname, username, password: hash })
                    userModelInstance.save().then(doc => resolve()).catch(error => reject(error))
                }).catch(error => reject(error))
            }).catch(error => reject(error))
        })
    }

    static isUserIsset(username, password, callback) {
        return new Promise((resolve, reject) => {
            userModel.findOne({ username })
                .then(doc => {
                    if (!doc) return reject('Incorrect username')
                    bcrypt.compare(password, doc.password).then(hash => {
                        if (!hash) return reject('Incorrect password')
                        if (hash) { resolve() }
                    }).catch(error => reject(error))
                })
                .catch(error => reject(error))
        })
    }

    static savePost(username, filename, text, avatar, timestamp, token, callback) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {

                if (error) return reject(error)
                if (!decoded) return reject('Not authorized')
                if (decoded.username != username) return reject("Token username doesn't match username from req")

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
                                timestamp: timestamp,
                                likedBy: []
                            }
                        }
                    }).then(doc => { resolve() })
                    .catch(error => reject(error))
            })
        })
    }

    static getNewsByArrOfSUbscriptions(arr) {
        return new Promise((resolve, reject) => {
            let newsArr = []
            if (arr.length <= 0) resolve([])
            arr.map((el, i) => {
                userModel.findOne({ username: el.username }, { posts: 1 }, (err, response) => {
                    newsArr = newsArr.concat(response.posts)
                    if (i + 1 == arr.length) {
                        newsArr.sort((a, b) => {
                            if (a.timestamp > b.timestamp) {
                                return -1
                            }
                            else {
                                return 1
                            }
                        })
                        resolve(newsArr)
                    }
                })
            })
        })
    }

    static getNewsByUsername(username, page, perpage, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (!decoded) return callback('Not authorized', [])
                if (decoded.username != username) return reject("Token username doesn't match username from req", [])

                let end = page * perpage
                let start = end - (perpage - 1) - 1

                userModel.findOne({ username: username }, { subscriptions: 1 }, function (error, doc) {
                    if (error) throw error
                    const { subscriptions } = doc || []

                    if (!subscriptions) resolve([])

                    userController.getNewsByArrOfSUbscriptions(subscriptions)
                        .then(news => resolve(news.splice(start, perpage)))
                        .catch(error => reject(error))
                })
            })
        })
    }

    static getPublicUser(username) {
        return new Promise((resolve, reject) => {
            userModel.findOne({ username: username }, {
                username: 1,
                fullname: 1,
                posts: 1,
                avatar: 1,
                subscribers: 1,
                subscriptions: 1,
                news: 1,
                about: 1
            }, (error, doc) => {
                if (error) return reject(error)
                doc ? doc.posts.sort((a, b) => {
                    if (a.timestamp > b.timestamp) {
                        return -1
                    }
                    else {
                        return 1
                    }
                }) : null
                resolve(doc)
            })
        })
    }

    static subscribe(username, usernameToSubscribe) {
        return new Promise((resolve, reject) => {
            userModel.findOne({ username: username }, function (error, doc) {
                const { subscriptions } = doc
                if (subscriptions.some(el => el.username == usernameToSubscribe)) return reject('Already subscribed')

                userModel.updateOne({ username: username }, {
                    $push: {
                        subscriptions: {
                            username: usernameToSubscribe
                        }
                    }
                }, (error) => {
                    if (error) return reject(error)
                    userModel.updateOne({ username: usernameToSubscribe }, {
                        $push: {
                            subscribers: {
                                username: username
                            }
                        }
                    }, (error) => {
                        if (error) return reject(error)
                        resolve()
                    })
                })
            })
        })
    }

    static unSubscribe(username, usernameToUnSubscribe) {
        return new Promise((resolve, reject) => {
            userModel.updateOne({ username: username }, {
                $pull: {
                    subscriptions: {
                        username: usernameToUnSubscribe
                    }
                }
            }, (error) => {
                if (error) return reject(error)
                userModel.updateOne({ username: usernameToUnSubscribe }, {
                    $pull: {
                        subscribers: {
                            username: username
                        }
                    }
                }, (error) => {
                    if (error) throw error
                    resolve(true)
                })
            })
        })
    }

    static addLike(likedUsername, usernamePostedPost, postID, token) {

        /* Query an Array of Embedded Documents
         * https://docs.mongodb.com/manual/tutorial/query-array-of-documents/
         * If you do not know the index position of the document nested in the array,
         * concatenate the name of the array field, with a dot (.) and the name of 
         * the field in the nested document.
        */

        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (!decoded) return reject('Not authorized')
                if (likedUsername != decoded.username) return reject("Token username doesn't match username from req")

                userModel.find({
                    $and: [
                        { 'username': { $eq: { usernamePostedPost } } },
                        { 'posts.id': { $eq: postID } },
                        { 'posts.likedBy.username': { $eq: likedUsername } }
                    ]
                }, { posts: 1 }, (error, doc) => {
                    if (doc) return reject('Already liked')

                    userModel.updateOne({
                        $and: [
                            { 'username': { $eq: usernamePostedPost } },
                            {
                                'posts.id': {
                                    $eq: postID
                                }
                            }
                        ]
                    },
                        {
                            $push: {
                                /* Dollar sign is the number of
                                 * position of element that has been
                                 * found in query (posts.id)
                                 * without posts.id there would be an error
                                 * because with only 'username' operator $ 
                                 * could not find one number for position
                                 * the ID of post must be uniq for every field
                                 * because if it would not be uniq
                                 * the sign of DOLLAR will be equal to 0
                                 * so this query will update only the first field of array
                                */
                                'posts.$.likedBy': {
                                    username: likedUsername
                                }
                            }
                        }, (error, doc) => {
                            if (error) throw error
                            resolve('Successfuly liked')
                        })

                })
            })
        })
    }

    static removeLike(likedUsername, usernamePostedPost, postID, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (!decoded) return reject('Not authorized')
                if (likedUsername != decoded.username) return reject("Token username doesn't match username from req")

                userModel.updateOne({
                    username: { $eq: usernamePostedPost },
                    'posts.id': {
                        $eq: postID
                    }
                },
                    {
                        $pull: {
                            'posts.$.likedBy': {
                                username: likedUsername
                            }
                        }
                    }, (error, doc) => {
                        if (error) return reject(error)
                        resolve()
                    })
            })
        })
    }

    static suggestion(username) {
        return new Promise((resolve, reject) => {
            userModel.find({
                $and: [
                    {
                        $or: [
                            { $where: "this.subscribers.length >= 0" },
                            { $where: 'this.posts.length >= 0' }
                        ]
                    },
                    { username: { $not: { $eq: username } } }
                ]
            }, (error, docs) => {
                if (error) return reject(error)
                if (docs.length === 0) resolve([])
                const newArr = []
                docs.map((el, i) => {
                    newArr.push({ username: el.username, fullname: el.fullname, avatar: el.avatar })
                    if (i + 1 == docs.length) resolve(newArr)
                })
            }).limit(10)
        })
    }

    static createDialog(users, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (error) return reject(error)
                if (!decoded) return reject('Not authorized')
                if (users.some(el => { el.username != decoded.username })) return reject("Token username doesn't match username from req")

                messageModel.findOne({
                    users: { $eq: users }
                }, (error, doc) => {
                    if (error) throw error
                    if (doc) resolve(doc.id)

                    const dialogID = uniqid()
                    new messageModel({
                        id: dialogID,
                        users: users,
                        messages: []
                    }).save((error) => {
                        if (error) return reject(error)
                        let pureUsersArr = []
                        users.map(el => pureUsersArr.push(el.username))
                        userModel.updateMany({ username: { $in: pureUsersArr } }, { $push: { messages: dialogID } })
                            .then(res => resolve(dialogID))
                            .catch(error => reject(error))
                    })
                })
            })
        })
    }

    static addMessage(username, message, roomID, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {

                if (error) return reject(error)
                if (!decoded) return reject('Not authorized')
                if (username != decoded.username) return reject("Token username doesn't match username from req")

                messageModel.findOne({ id: roomID }, (error, doc) => {
                    if (error) return reject(error)
                    if (!doc) return reject('no such room')

                    messageModel.updateOne({ id: roomID }, {
                        $push: {
                            messages: { username, message, timestamp: Date.now() }
                        }
                    }, (error, result) => resolve())
                })
            })
        })
    }

    static getMessages(username, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (error) return reject(error)
                if (!decoded) return reject('Not authorized')
                if (decoded.username != username) return reject("Token username doesn't match username from req")

                userModel.findOne({ username: username }, { messages: 1 })
                    .then(doc => {
                        if (doc.messages.length == 0) resolve([])
                        messageModel.find({ id: { $in: doc.messages } })
                            .then(res => {
                                if (res.length == 0) reject('No messages')
                                res.map((el1, i) => {
                                    el1.users.map((el, j) => {
                                        userModel.findOne({ username: el.username }, { username: 1, avatar: 1, _id: 0 })
                                            .then(doc => {
                                                if (doc && doc.avatar) el.avatar = doc.avatar
                                                if (j + 1 == el1.users.length && res.length == i + 1) {

                                                    resolve(res)
                                                }

                                            })
                                            .catch(error => reject(error))
                                    })
                                })
                            })
                            .catch(error => reject(error))
                    })
                    .catch(error => reject(error))
            })
        })
    }

    static getDialog(dialogID, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (error) return reject(error)
                if (!decoded) return reject('!decoded')
                messageModel.findOne({ id: dialogID }, (error, doc) => {
                    if (error) return reject(error)

                    if (doc.users && doc.users.some(el => el.username == decoded.username)) { resolve(doc) }
                    else {
                        reject('Not user dialog')
                    }
                })
            })
        })
    }

    static search(query) {
        return new Promise((resolve, reject) => {
            const q = new RegExp(query)
            userModel.find({
                $or: [
                    { username: q },
                    { fullname: q }
                ]
            }, {
                username: 1, fullname: 1, avatar: 1
            }, (error, docs) => {
                if (error) return reject(error)
                resolve(docs)
            })
        })
    }

    static async updateUser(oldUsername, newUsername, newFullname, newPassword, newAbout, newAvatar) {
        await new Promise(async (resolve, reject) => {
            let query = {}
            if (newAvatar) query.avatar = newAvatar
            if (newFullname) query.fullname = newFullname
            query.about = newAbout
            if (!newAbout) { query.about = '' }
            else { query.about = newAbout }

            if (newUsername) {
                await this.usernameIsFree(newUsername).then((onResolved) => {
                    if (!onResolved) reject('Имя занято')
                    query.username = newUsername
                }).catch((err) => reject('Произошла ошибка'))
            }

            if (newPassword) {
                await bcrypt.hash(newPassword, 10).then(hash => query.password = hash, error => reject('Произошла ошибка'))
            }

            resolve(query)
        })
            .then(query => {
                return new Promise((resolve, reject) => {
                    userModel.updateOne({ username: oldUsername }, query)
                        .then(onResolved => resolve())
                        .catch(error => reject('Произошла ошибка'))
                })
            })
            .catch(error => {
                return new Promise((resolve, reject) => {
                    reject(error)
                })
            })
    }

    static dialogLastVisit(dialogID, username) {
        return new Promise((resolve, reject) => {
            messageModel.updateOne({ id: dialogID, 'users.username': { $eq: username } }, {
                $set: {
                    'users.$.lastVisited': Date.now()
                }
            })
                .then(res => resolve())
                .catch(error => reject(error))
        })
    }

    static messagesAmount(dialogID, username) {
        return new Promise((resolve, reject) => {
            messageModel.findOne({ id: dialogID }, { users: 1, _id: 0, messages: 1 })
                .then(res => {
                    res.users.map(el => {
                        if (el.username == username) {
                            resolve({ lastVisited: el.lastVisited, messages: res.messages, authUsername: username })
                        }
                    })
                })
                .catch(error => reject(error))
        }).then(data => {
            return new Promise((resolve, reject) => {
                let newMsgs = 0
                data.messages.map((el, i) => {
                    if (el.timestamp > data.lastVisited && el.username !== data.authUsername) {
                        newMsgs++
                    }
                    if (i + 1 == data.messages.length) {
                        resolve(newMsgs)
                    }
                })
            })
        })
            .catch(error => {
                return new Promise((resolve, reject) => {
                    reject(error)
                })
            })
    }

    static allMessagesAmount(username) {
        return new Promise(async (resolve, reject) => {
            userModel.findOne({ username }, { messages: 1, _id: 0 })
                .then(userMessages => {
                    let allMSGS = 0
                    userMessages.messages.map((dialogID, i) => {
                        this.messagesAmount(dialogID, username)
                            .then(messages => {
                                allMSGS += messages
                                if (i + 1 == userMessages.messages.length) return resolve(allMSGS)
                            })
                            .catch(error => reject(error))
                    })
                })
                .catch(error => reject(error))
        })
    }
}

module.exports = userController