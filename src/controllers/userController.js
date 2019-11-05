require('dotenv').config()
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const messageModel = require('../models/messages')
const bcrypt = require('bcrypt')
var uniqid = require('uniqid')

class userController {
    /* Test covered */
    static usernameIsFree(username) {
        return new Promise((resolve, reject) => {
            userModel.find({ username }, (error, docs) => {
                if (error) return reject(error)
                if (docs.length > 0) resolve(false)
                else resolve(true)
            })
        })
    }

    /* Test covered */
    static save(fullname, username, password) {
        return new Promise((resolve, reject) => {
            if (!username) return reject('Имя пользователя не заполнено')
            if (!password) return reject('Пароль не заполнен')
            if (!fullname) return reject('Имя не заполнено')
            this.usernameIsFree(username)
                .then((isFree) => {
                    if (!isFree) return reject('Имя занято')
                    bcrypt
                        .hash(password, 10)
                        .then((hash) => {
                            const userModelInstance = new userModel({ fullname, username, password: hash })
                            userModelInstance
                                .save()
                                .then((doc) => resolve())
                                .catch((error) => reject(error))
                        })
                        .catch((error) => reject(error))
                })
                .catch((error) => reject(error))
        })
    }

    /* Test covered */
    static isUserIsset(username, password) {
        return new Promise((resolve, reject) => {
            userModel
                .findOne({ username })
                .then((doc) => {
                    if (!doc) return reject('Incorrect username')
                    bcrypt
                        .compare(password, doc.password)
                        .then((hash) => {
                            if (!hash) return reject('Incorrect password')
                            if (hash) {
                                resolve()
                            }
                        })
                        .catch((error) => reject(error))
                })
                .catch((error) => reject(error))
        })
    }

    /* Test covered */
    static savePost(username, text, timestamp, token, buffer) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, async (error, decoded) => {
                if (error) return reject('Not authorized')
                if (!decoded) return reject('Not authorized')
                if (decoded.username != username) return reject("Token username doesn't match username from req")

                let usernameID
                await this.getUserIdByUsername(username)
                    .then((_id) => (usernameID = _id))
                    .catch((err) => reject(err))

                userModel
                    .updateOne(
                        { username: username },
                        {
                            $push: {
                                posts: {
                                    _id: usernameID,
                                    id: uniqid(),
                                    text: text,
                                    username: username,
                                    timestamp: timestamp,
                                    likedBy: [],
                                    buffer: buffer
                                }
                            }
                        }
                    )
                    .then((doc) => {
                        resolve()
                    })
                    .catch((error) => reject(error))
            })
        })
    }

    static getNewsByArrOfSUbscriptions(arr) {
        return new Promise((resolve, reject) => {
            let newsArr = []
            if (arr.length <= 0) return resolve([])
            userModel
                .find({ _id: { $in: arr } }, { _id: 0, username: 1, avatar: 1, fullname: 1, posts: 1 })
                .then((response) => {
                    const { posts } = response

                    let newArr = []

                    response.map((el) => {
                        el.posts.map((el2) => {
                            delete el2.username
                            delete el2.avatar

                            newArr.push({
                                username: el.username,
                                fullname: el.fullname,
                                avatar: el.avatar,
                                post: el2
                            })
                        })
                    })

                    newArr.sort((a, b) => {
                        if (a.post.timestamp > b.post.timestamp) {
                            return -1
                        } else {
                            return 1
                        }
                    })

                    resolve(newArr)
                })
                .catch((error) => {
                    reject(error)
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

                userModel.findOne({ username: username }, { subscriptions: 1 }, function(error, doc) {
                    if (error) throw error
                    const { subscriptions } = doc || []

                    if (!subscriptions) resolve([])

                    userController
                        .getNewsByArrOfSUbscriptions(subscriptions)
                        .then((news) => resolve(news.splice(start, perpage)))
                        .catch((error) => reject(error))
                })
            })
        })
    }

    static getPublicUser(username) {
        return new Promise((resolve, reject) => {
            userModel.findOne(
                { username: username },
                {
                    _id: 1,
                    username: 1,
                    fullname: 1,
                    posts: 1,
                    avatar: 1,
                    subscribers: 1,
                    subscriptions: 1,
                    news: 1,
                    about: 1
                },
                (error, doc) => {
                    if (error) return reject(error)
                    doc
                        ? doc.posts.sort((a, b) => {
                              if (a.timestamp > b.timestamp) {
                                  return -1
                              } else {
                                  return 1
                              }
                          })
                        : null
                    resolve(doc)
                }
            )
        })
    }

    static getUserIdByUsername(username) {
        return new Promise((resolve, reject) => {
            userModel
                .findOne({ username })
                .then((res) => resolve(res._id))
                .catch((err) => reject('Error'))
        })
    }

    static subscribe(username_ID, usernameToSubscribe_ID) {
        return new Promise((resolve, reject) => {
            userModel.findOne({ _id: username_ID }, function(error, doc) {
                const { subscriptions } = doc

                if (subscriptions.includes(usernameToSubscribe_ID)) return reject('Already subscribed')

                userModel.updateOne(
                    { _id: username_ID },
                    {
                        $push: {
                            subscriptions: usernameToSubscribe_ID
                        }
                    },
                    (error) => {
                        if (error) return reject(error)
                        userModel.updateOne(
                            { _id: usernameToSubscribe_ID },
                            {
                                $push: {
                                    subscribers: username_ID
                                }
                            },
                            (error) => {
                                if (error) return reject(error)
                                resolve()
                            }
                        )
                    }
                )
            })
        })
    }

    static unSubscribe(username_ID, usernameToUnSubscribe_ID) {
        return new Promise((resolve, reject) => {
            userModel.updateOne(
                { _id: username_ID },
                {
                    $pull: {
                        subscriptions: usernameToUnSubscribe_ID
                    }
                },
                (error) => {
                    if (error) return reject(error)
                    userModel.updateOne(
                        { _id: usernameToUnSubscribe_ID },
                        {
                            $pull: {
                                subscribers: username_ID
                            }
                        },
                        (error) => {
                            if (error) throw error
                            resolve(true)
                        }
                    )
                }
            )
        })
    }

    static addLike(usernameID, usernamePostedPostID, postID, token) {
        console.log(usernameID, usernamePostedPostID)
        /* Query an Array of Embedded Documents
         * https://docs.mongodb.com/manual/tutorial/query-array-of-documents/
         * If you do not know the index position of the document nested in the array,
         * concatenate the name of the array field, with a dot (.) and the name of
         * the field in the nested document.
         */

        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (!decoded) return reject('Not authorized')
                // if (likedUsername != decoded.username) return reject("Token username doesn't match username from req")

                userModel.find(
                    {
                        $and: [{ _id: { $eq: { usernamePostedPostID } } }, { 'posts.id': { $eq: postID } }, { 'posts.likedBy._id': { $eq: usernameID } }]
                    },
                    { posts: 1 },
                    (error, doc) => {
                        if (doc) return reject('Already liked')

                        userModel.updateOne(
                            {
                                $and: [
                                    { _id: { $eq: usernamePostedPostID } },
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
                                        _id: usernameID
                                    }
                                }
                            },
                            (error, doc) => {
                                if (error) throw error
                                resolve('Successfuly liked')
                            }
                        )
                    }
                )
            })
        })
    }

    static removeLike(usernameID, usernamePostedPostID, postID, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (!decoded) return reject('Not authorized')
                //if (likedUsername != decoded.username) return reject("Token username doesn't match username from req")

                userModel.updateOne(
                    {
                        _id: { $eq: usernamePostedPostID },
                        'posts.id': {
                            $eq: postID
                        }
                    },
                    {
                        $pull: {
                            'posts.$.likedBy': {
                                _id: usernameID
                            }
                        }
                    },
                    (error, doc) => {
                        if (error) return reject(error)
                        resolve()
                    }
                )
            })
        })
    }

    static suggestion(username) {
        return new Promise((resolve, reject) => {
            userModel
                .find(
                    {
                        $and: [
                            {
                                $or: [{ $where: 'this.subscribers.length >= 0' }, { $where: 'this.posts.length >= 0' }]
                            },
                            { username: { $not: { $eq: username } } }
                        ]
                    },
                    (error, docs) => {
                        if (error) return reject(error)
                        if (docs.length === 0) resolve([])
                        const newArr = []
                        docs.map((el, i) => {
                            newArr.push({ username: el.username, fullname: el.fullname, avatar: el.avatar })
                            if (i + 1 == docs.length) resolve(newArr)
                        })
                    }
                )
                .limit(10)
        })
    }

    static createDialog(users, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (error) return reject(error)
                if (!decoded) return reject('Not authorized')
                // if (
                //     users.some((el) => {
                //         el.username != decoded.username
                //     })
                // )
                //     return reject("Token username doesn't match username from req")
                userModel
                    .findOne({ 'messages.users': { $all: users } })
                    .then((response) => {
                        if (response) return resolve(response.messages[0].dialogID)

                        const dialogID = uniqid()
                        userModel
                            .updateMany({ _id: { $in: users } }, { $push: { messages: { dialogID: dialogID, users: users, messages: [] } } })
                            .then((doc) => {
                                resolve(dialogID)
                            })
                            .catch((error) => reject(error))
                    })
                    .catch((error) => reject(error))
            })
        })
    }

    static addMessage(username, message, roomID, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (error) return reject(error)
                if (!decoded) return reject('Not authorized')
                if (username != decoded.username) return reject("Token username doesn't match username from req")
                userModel
                    .updateMany({ 'messages.dialogID': roomID }, { $push: { 'messages.$.messages': { message: message, username: username, timestamp: Date.now() } } })
                    .then((res) => {
                        resolve()
                    })
                    .catch((error) => reject(error))
            })
        })
    }
    static getMessages(username, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (error) return reject(error)
                if (!decoded) return reject('Not authorized')
                if (decoded.username != username) return reject("Token username doesn't match username from req")

                userModel
                    .findOne({ username: username }, { messages: 1 })
                    .then(async (res) => {
                        let messages = res.messages
                        if (messages.length == 0) return resolve([])
                        for (let i = 0; i < messages.length; i++) {
                            await userModel
                                .find({ _id: { $in: messages[i].users } }, { username: 1, avatar: 1, _id: 0 })
                                .then((res) => (messages[i].users = res))
                                .catch((error) => reject(error))
                            if (i + 1 == messages.length) return resolve(messages)
                        }
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        })
    }

    static getDialog(dialogID, token) {
        const self = this
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (error) return reject(error)
                if (!decoded) return reject('!decoded')
                userModel
                    .findOne({ 'messages.dialogID': dialogID }, { messages: 1, _id: 0 })
                    .then((res) => {
                        res.messages.map((el) => {
                            if (el.dialogID == dialogID) {
                                userModel.find({ _id: { $in: el.users } }, { avatar: 1, _id: 0, username: 1 }).then((res) => {
                                    el.users_2 = res
                                    return resolve(el)
                                })
                            }
                        })
                    })
                    .catch((error) => reject(error))
            })
        })
    }

    static search(query) {
        return new Promise((resolve, reject) => {
            const q = new RegExp(query)
            userModel.find(
                {
                    $or: [{ username: q }, { fullname: q }]
                },
                {
                    username: 1,
                    fullname: 1,
                    avatar: 1
                },
                (error, docs) => {
                    if (error) return reject(error)
                    resolve(docs)
                }
            )
        })
    }

    static async updateUser(oldUsername, newUsername, newFullname, newPassword, newAbout, avatarBuffer) {
        await new Promise(async (resolve, reject) => {
            let query = {}
            if (avatarBuffer) query.avatar = avatarBuffer.toString('base64')
            if (newFullname) query.fullname = newFullname
            query.about = newAbout
            if (!newAbout) {
                query.about = ''
            } else {
                query.about = newAbout
            }

            if (newUsername) {
                await this.usernameIsFree(newUsername)
                    .then((onResolved) => {
                        if (!onResolved) reject('Имя занято')
                        query.username = newUsername
                    })
                    .catch((err) => reject('Произошла ошибка'))
            }

            if (newPassword) {
                await bcrypt.hash(newPassword, 10).then((hash) => (query.password = hash), (error) => reject('Произошла ошибка'))
            }

            resolve(query)
        })
            .then((query) => {
                return new Promise((resolve, reject) => {
                    userModel
                        .updateOne({ username: oldUsername }, query)
                        .then((onResolved) => resolve())
                        .catch((error) => reject('Произошла ошибка'))
                })
            })
            .catch((error) => {
                return new Promise((resolve, reject) => {
                    reject(error)
                })
            })
    }

    static dialogLastVisit(dialogID, username) {
        return new Promise((resolve, reject) => {
            messageModel
                .updateOne(
                    { id: dialogID, 'users.username': { $eq: username } },
                    {
                        $set: {
                            'users.$.lastVisited': Date.now()
                        }
                    }
                )
                .then((res) => resolve())
                .catch((error) => reject(error))
        })
    }

    static messagesAmount(dialogID, username) {
        return new Promise((resolve, reject) => {
            messageModel
                .findOne({ id: dialogID }, { users: 1, _id: 0, messages: 1 })
                .then((res) => {
                    res.users.map((el) => {
                        if (el.username == username) {
                            resolve({ lastVisited: el.lastVisited, messages: res.messages, authUsername: username })
                        }
                    })
                })
                .catch((error) => reject(error))
        })
            .then((data) => {
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
            .catch((error) => {
                return new Promise((resolve, reject) => {
                    reject(error)
                })
            })
    }

    static allMessagesAmount(username) {
        return new Promise(async (resolve, reject) => {
            userModel
                .findOne({ username }, { messages: 1, _id: 0 })
                .then((userMessages) => {
                    let allMSGS = 0
                    userMessages.messages.map((dialogID, i) => {
                        this.messagesAmount(dialogID, username)
                            .then((messages) => {
                                allMSGS += messages
                                if (i + 1 == userMessages.messages.length) return resolve(allMSGS)
                            })
                            .catch((error) => reject(error))
                    })
                })
                .catch((error) => reject(error))
        })
    }

    static getSubscriptionsByUsername(username) {
        return new Promise((resolve, reject) => {
            userModel
                .findOne({ username }, { subscriptions: 1, _id: 0 })
                .then((res) => {
                    userModel
                        .find({ username: { $in: res.subscriptions } }, { username: 1, avatar: 1, fullname: 1, _id: 0 })
                        .then((result) => {
                            resolve(result)
                        })
                        .catch((error) => {
                            reject(error)
                        })
                })
                .catch((error) => reject('Error'))
        })
    }
}

// indentity by username -> fix it

module.exports = userController
