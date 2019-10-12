const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
var uniqid = require('uniqid');
const messageModel = require('../models/messages')

class userController {

    static usernameIsFree(username, callback) {
        userModel.find({ username: username }, (error, docs) => {
            if (error) throw error
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
        userModelInstance.save((error) => {
            callback(error)
        })
    }

    static login(username, password, callback) {
        userModel.findOne({ username: username, password: password }, (error, doc) => {
            if (error) throw error
            doc ? callback(true) : callback(false)
        })
    }

    static savePost(username, filename, text, avatar, timestamp, token, callback) {
        jwt.verify(token, 'Some key', (err, decoded) => {
            if (!decoded) { return callback('Not authorized') }
            if (decoded.username != username) { return callback("Token username doesn't match username from req") }

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
                }, (error) => {
                    callback(error)
                })
        })
    }

    static async removePost(username, postID, callback) {
        const up = await userModel.updateOne({ username: username }, { $pull: { posts: { id: postID } } })
        up.nModified == 1 ? callback(true) : callback(false)
    }

    static getNewsByArrOfSUbscriptions(arr, callback) {
        let newsArr = []
        if (arr.length <= 0) { return callback([]) }
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
                    callback(newsArr)
                }
            })
        })

    }

    static getNewsByUsername(username, page, perpage, token, callback) {
        jwt.verify(token, 'Some key', (error, decoded) => {
            if (!decoded) return callback('Not authorized', [])
            if (decoded.username != username) return callback("Token username doesn't match username from req", [])

            let end = page * perpage
            let start = end - (perpage - 1) - 1

            userModel.findOne({ username: username }, { subscriptions: 1 }, function (error, doc) {
                if (error) throw error
                const { subscriptions } = doc || []

                if (!subscriptions) return callback('', [])

                userController.getNewsByArrOfSUbscriptions(subscriptions, (response) => {
                    const newArr = response.splice(start, perpage)
                    callback('', newArr)
                })
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
        }, (err, doc) => {
            if (err) throw err
            callback(doc)
        })
    }

    static subscribe(username, usernameToSubscribe, callback) {
        userModel.findOne({ username: username }, function (error, doc) {
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
                }, (error) => {
                    if (error) throw error
                    userModel.updateOne({ username: usernameToSubscribe }, {
                        $push: {
                            subscribers: {
                                username: username
                            }
                        }
                    }, (error) => {
                        if (error) throw error
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
        }, (error) => {
            if (error) throw error
            userModel.updateOne({ username: usernameToUnSubscribe }, {
                $pull: {
                    subscribers: {
                        username: username
                    }
                }
            }, (error) => {
                if (error) throw error
                callback(true)
            })
        })
    }

    static addLike(likedUsername, usernamePostedPost, postID, token, callback) {

        /* Query an Array of Embedded Documents
         * https://docs.mongodb.com/manual/tutorial/query-array-of-documents/
         * If you do not know the index position of the document nested in the array,
         * concatenate the name of the array field, with a dot (.) and the name of 
         * the field in the nested document.
        */

        jwt.verify(token, 'Some key', (error, decoded) => {
            if (!decoded) return callback('Not authorized')
            if (likedUsername != decoded.username) return callback("Token username doesn't match username from req")

            userModel.find({
                $and: [
                    { 'username': { $eq: { usernamePostedPost } } },
                    { 'posts.id': { $eq: postID } },
                    { 'posts.likedBy.username': { $eq: likedUsername } }
                ]
            }, { posts: 1 }, (error, doc) => {
                if (doc) return callback('ALready liked')

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
                        callback('Successfuly liked')
                    })

            })
        })
    }

    static removeLike(likedUsername, usernamePostedPost, postID, token, callback) {
        jwt.verify(token, 'Some key', (error, decoded) => {
            if (!decoded) return callback('Not authorized')
            if (likedUsername != decoded.username) return callback("Token username doesn't match username from req")

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
                    if (error) throw error
                    callback('')
                })
        })
    }

    static suggestion(username, callback) {
        userModel.find({
            $or: [
                { $where: "this.subscribers.length >= 0" },
                { $where: 'this.posts.length >= 0' }
            ]

        }, (error, docs) => {
            const newArr = []
            docs.map((el, i) => {
                newArr.push({ username: el.username, fullname: el.fullname, avatar: el.avatar })
                if (i + 1 == docs.length) callback(newArr)
            })
        })
    }

    static createDialog(users, token, callback) {
        jwt.verify(token, 'Some key', (error, decoded) => {
            if (!decoded) return callback('Not authorized', [])
            if (users.some(el => { el.username != decoded.username })) return callback("Token username doesn't match username from req")

            messageModel.findOne({
                users: { $eq: users }
            }, (error, doc) => {
                if (error) throw error
                if (doc) return callback('Dialog already exists', doc.id)

                const dialogID = uniqid()
                new messageModel({
                    id: dialogID,
                    users: users,
                    messages: []
                }).save((error) => {
                    if (error) throw error
                    let pureUsersArr = []
                    users.map(el => pureUsersArr.push(el.username))
                    userModel.updateMany({ username: { $in: pureUsersArr } }, { $push: { messages: dialogID } }, (error, resp) => callback('', dialogID))
                })
            })
        })
    }

    static addMessage(username, message, roomID, token, callback) {
        jwt.verify(token, 'Some key', (error, decoded) => {
            if (!decoded) return callback('Not authorized')
            if (username != decoded.username) return callback("Token username doesn't match username from req")
            messageModel.findOne({ id: roomID }, (error, doc) => {
                if (!doc) return callback('no such room')
                messageModel.updateOne({ id: roomID }, {
                    $push: {
                        messages: { username, message }
                    }
                }, (error, result) => callback(''))
            })
        })
    }

    static getMessages(username, token, callback) {
        jwt.verify(token, 'Some key', (error, decoded) => {
            if (!decoded) return callback('Not authorized', [])
            if (decoded.username != username) return callback("Token username doesn't match username from req", [])

            userModel.findOne({ username: username }, { messages: 1 }, (error, doc) => {
                if (error) throw error
                if (doc.messages.length == 0) return callback('', [])

                messageModel.find({ id: { $in: doc.messages } }, (error, res) => {
                    res.map((el1, i) => {
                        el1.users.map((el, j) => {
                            userModel.findOne({ username: el.username }, { username: 1, avatar: 1, _id: 0 }, (error, doc) => {
                                el.avatar = doc.avatar
                                if (j + 1 == el1.users.length && res.length == i + 1) callback('', res)
                            })
                        })
                    })
                })
            })
        })
    }

    static getDialog(dialogID, token, callback) {
        jwt.verify(token, 'Some key', (error, decoded) => {
            if (!decoded) { return callback('', []) }
            messageModel.findOne({ id: dialogID }, (error, doc) => {
                if (doc.users.some(el => el.username == decoded.username)) return callback('', doc)
                callback('Not user dialog')
            })
        })
    }

    static search(query, callback) {
        const q = new RegExp(query)
        console.log(q)
        userModel.find({
            $or: [
                { username: q },
                { fullname: q }
            ]
        }, {
            username: 1, fullname: 1, avatar: 1
        }, (error, docs) => {
            callback('', docs)
        })
    }
}

module.exports = userController