import UserModel from '../models/UserModel'
const bcrypt = require('bcrypt')

interface createUserInterface {
    username: String
    fullName: String
    password: String
}

interface updateUserInterface {
    oldUsername: any
    newUsername: any
    newFullName: any
    newPassword: any
    newAbout: any
    avatarBuffer: any
}

class UserController {
    private isUsernameIsFree(username: String) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ username }, (error: Error, doc: String) => {
                if (error) return reject(error)
                if (doc) return resolve(false)
                resolve(true)
            })
        })
    }

    public createUser(user: createUserInterface) {
        return new Promise((resolve, reject) => {
            if (!user.username) return reject('Имя пользователя не заполнено')
            if (!user.password) return reject('Пароль не заполнен')
            if (!user.fullName) return reject('Имя не заполнено')
            this.isUsernameIsFree(user.username)
                .then((isFree) => {
                    if (!isFree) return reject('Имя занято')
                    bcrypt
                        .hash(user.password, 10)
                        .then((hash: String) => {
                            const userModelInstance = new UserModel({ fullname: user.fullName, username: user.username, password: hash })
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

    public updateUser(user: updateUserInterface) {
        return new Promise(async (resolve, reject) => {
            let query = {}
            if (user.avatarBuffer) query.avatar = user.avatarBuffer.toString('base64')
            if (user.newFullName) query.fullname = user.newFullName
            query.about = user.newAbout
            if (!user.newAbout) {
                query.about = ''
            } else {
                query.about = user.newAbout
            }

            if (user.newUsername) {
                await this.isUsernameIsFree(user.newUsername)
                    .then((onResolved: any) => {
                        if (!onResolved) reject('Имя занято')
                        query.username = user.newUsername
                    })
                    .catch((err: any) => reject('Произошла ошибка'))
            }

            if (user.newPassword) {
                await bcrypt.hash(user.newPassword, 10).then((hash: any) => (query.password = hash), (error: any) => reject('Произошла ошибка'))
            }

            resolve(query)
        })
            .then((query) => {
                return new Promise((resolve, reject) => {
                    UserModel.updateOne({ username: user.oldUsername }, query)
                        .then((onResolved: any) => resolve())
                        .catch((error: any) => reject('Произошла ошибка'))
                })
            })
            .catch((error) => {
                return new Promise((resolve, reject) => {
                    reject(error)
                })
            })
    }

    public getUserByUsername(username: String) {
        return new Promise((resolve, reject) => {
            UserModel.findOne(
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
                (error: any, doc: any) => {
                    if (error) return reject(error)
                    doc
                        ? doc.posts.sort((a: any, b: any) => {
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

    public getUserIdByUsername(username: String) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ username })
                .then((res: any) => resolve(res._id))
                .catch((err: any) => reject('Error'))
        })
    }

    public subscribe(username_ID: String, usernameToSubscribe_ID: String) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ _id: username_ID }, function(error: any, doc: any) {
                const { subscriptions } = doc

                if (subscriptions.includes(usernameToSubscribe_ID)) return reject('Already subscribed')

                UserModel.updateOne(
                    { _id: username_ID },
                    {
                        $push: {
                            subscriptions: usernameToSubscribe_ID
                        }
                    },
                    (error: any) => {
                        if (error) return reject(error)
                        UserModel.updateOne(
                            { _id: usernameToSubscribe_ID },
                            {
                                $push: {
                                    subscribers: username_ID
                                }
                            },
                            (error: any) => {
                                if (error) return reject(error)
                                resolve()
                            }
                        )
                    }
                )
            })
        })
    }

    public unSubscribe(username_ID: String, usernameToUnSubscribe_ID: String) {
        return new Promise((resolve, reject) => {
            UserModel.updateOne(
                { _id: username_ID },
                {
                    $pull: {
                        subscriptions: usernameToUnSubscribe_ID
                    }
                },
                (error: any) => {
                    if (error) return reject(error)
                    UserModel.updateOne(
                        { _id: usernameToUnSubscribe_ID },
                        {
                            $pull: {
                                subscribers: username_ID
                            }
                        },
                        (error: any) => {
                            if (error) throw error
                            resolve(true)
                        }
                    )
                }
            )
        })
    }

    public getSubscriptionsByUsername(username: String) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ username }, { subscriptions: 1, _id: 0 })
                .then((res: any) => {
                    UserModel.find({ username: { $in: res.subscriptions } }, { username: 1, avatar: 1, fullname: 1, _id: 0 })
                        .then((result: any) => {
                            resolve(result)
                        })
                        .catch((error: any) => {
                            reject(error)
                        })
                })
                .catch((error: any) => reject('Error'))
        })
    }
}

const UserControllerInstance: UserController = new UserController()

export default UserControllerInstance
