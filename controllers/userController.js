const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
var uniqid = require('uniqid');
const messageModel = require('../models/messages')

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
                        timestamp: timestamp,
                        likedBy: []
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

    static getNewsByArrOfSUbscriptions(arr, callback) {
        let newsArr = []
        if (arr.length > 0) {
            arr.map((el, i) => {
                userModel.findOne({ username: el.username }, { posts: 1 }, function (err, response) {
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
        else {
            callback([])
        }
    }

    static getNewsByUsername(username, page, perpage, callback) {
        let end = page * perpage
        let start = end - (perpage - 1) - 1

        userModel.findOne({ username: username }, { subscriptions: 1 }, function (err, doc) {
            if (err) throw err
            const { subscriptions } = doc || []

            if (!subscriptions) {
                callback([])
            }
            else {
                userController.getNewsByArrOfSUbscriptions(subscriptions, (response) => {
                    const newArr = response.splice(start, perpage)
                    callback(newArr)
                })
            }
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

    static addLike(likedUsername, usernamePostedPost, postID, callback) {

        /* Query an Array of Embedded Documents
         * https://docs.mongodb.com/manual/tutorial/query-array-of-documents/
         * If you do not know the index position of the document nested in the array,
         * concatenate the name of the array field, with a dot (.) and the name of 
         * the field in the nested document.
        */

        userModel.find({
            $and: [
                { 'username': { $eq: { usernamePostedPost } } },
                { 'posts.id': { $eq: postID } },
                { 'posts.likedBy.username': { $eq: likedUsername } }
            ]
        }, { posts: 1 }, (err, doc) => {
            if (doc) {
                callback('ALready liked')
            }
            else {
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
                             *  position of element that has been
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
                    }, function (err, doc) {
                        if (err) throw err
                        callback('Successfuly liked')
                    })
            }
        })
    }

    static removeLike(likedUsername, usernamePostedPost, postID, callback) {
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
            }, function (err, doc) {
                if (err) throw err
                callback('')
            })
    }

    static suggestion(username, callback) {
        userModel.find({
            $or: [
                { $where: "this.subscribers.length >= 0" },
                { $where: 'this.posts.length >= 0' }
            ]

        }, (err, docs) => {
            const newArr = []
            docs.map((el, i) => {
                newArr.push({ username: el.username, fullname: el.fullname, avatar: el.avatar })
                if (i + 1 == docs.length) {
                    callback(newArr)
                }
            })
        })
    }

    static createDialog(users, callback) {
        messageModel.findOne({
            users: { $eq: users }
        }, (err, doc) => {
            if (err) throw err
            if (doc) {
                callback('Dialog already exists', doc.id)
            }
            else {
                const dialogID = uniqid()
                new messageModel({
                    id: dialogID,
                    users: users,
                    messages: []
                }).save((err) => {
                    if (err) throw err
                    let pureUsersArr = []
                    users.map(el => {
                        pureUsersArr.push(el.username)
                    })
                    userModel.updateMany({
                        username: { $in: pureUsersArr }
                    }, { $push: { messages: dialogID } }, (err, resp) => {
                        callback('', dialogID)
                    })
                })
            }
        })
    }

    static addMessage(username, message, roomID, callback) {
        messageModel.findOne({ id: roomID }, (err, doc) => {
            if (doc) {
                messageModel.updateOne({ id: roomID }, {
                    $push: {
                        messages: { username, message }
                    }
                }, (err, result) => {
                    callback('')
                })
            }
            else {
                callback('no such room')
            }
        })
    }

    static getMessages(username, callback) {
        userModel.findOne({ username: username }, { messages: 1 }, (err, doc) => {
            messageModel.find({ id: { $in: doc.messages } }, (err, res) => {
                res.map((el1, i) => {
                    el1.users.map((el, j) => {
                        userModel.findOne({ username: el.username }, { username: 1, avatar: 1, _id: 0 }, (err, doc) => {
                            el.avatar = doc.avatar
                            if (j + 1 == el1.users.length) {
                                let obj = {}
                                obj.dialogs = res
                                callback(obj)
                            }
                        })
                    })
                })
            })
        })
    }

    static getDialog(dialogID, loggedUsername, callback) {
        /* Checking if logged username is in the users array
         *  Because if not then if is abuser
        */
        messageModel.findOne({ id: dialogID }, (err, doc) => {
            if (doc.users.some(el => el.username == loggedUsername)) {
                callback('', doc)
            }
            else {
                callback('Not user dialog')
            }
        })
    }

}

module.exports = userController