const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const _ = require('lodash')
import UserModel from '../models/UserModel'
import { Res, Req, User } from '../interfaces/index'
import Config from '../config'
import upload from '../middlewares/storage'

class UserController {
    static isUsernameIsFree(username: String) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ username }, (error: Error, doc: any) => {
                if (error) return reject(error)
                if (doc) return resolve(false)
                resolve(true)
            })
        })
    }

    public logout(req: Req, res: Res) {
        res.setHeader(
            'Set-Cookie',
            cookie.serialize('token', null, {
                maxAge: 0,
                path: '/',
            })
        )
        res.send({ status: 'ok' })
    }

    public createUser(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const { fullName, username, password } = req.body
            if (!_.trim(username) || !_.trim(password) || !_.trim(fullName)) return res.send({ status: 'error', error: 'Не все поля заполнены' })
            if (_.trim(username).length < 4) return reject('Имя пользователя должно содержать более 3 символов')
            if (_.trim(password).length < 4) return reject('Пароль должен содержать более 3 символов')
            if (_.trim(fullName).length < 2) return reject('Имя и фамилия должны содержать более 1 символа')

            UserController.isUsernameIsFree('username')
                .then(isFree => {
                    if (!isFree) return reject('Имя занято')
                    bcrypt
                        .hash(password, 10)
                        .then((hash: String) => {
                            const userModelInstance = new UserModel({ fullname: fullName, username: username, password: hash })
                            userModelInstance.save().then((doc: any) => {
                                jwt.sign({ user_id: doc._id, username }, Config.JWT_KEY, (err: any, token: any) => {
                                    res.setHeader(
                                        'Set-Cookie',
                                        cookie.serialize('token', token, {
                                            maxAge: 60 * 60 * 24 * 7,
                                            path: '/',
                                        })
                                    )
                                    resolve()
                                })
                            })
                                .catch((err: any) => reject(err))
                        })
                        .catch((err: any) => reject(err))
                })
                .catch(err => reject(err))
        }).then(response => res.send({ status: 'ok' })).catch(error => res.send({ status: 'error', error }))
    }

    public updateUser(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            upload(req, res, async (err: Error) => {
                if (err) return reject('Произошла ошибка, скорее всего файл слишком большой')
                const { oldUsername, newUsername, newPassword, newAbout, newFullname } = req.body
                const fileURL = req.files[0] ? req.files[0].location : null
                
                let query: User = {}

                if (fileURL) query.avatar = fileURL.toString('base64')

                if (newFullname) {
                    if (_.trim(newFullname).length < 2) return reject('Имя и фамилия должны содержать более 1 символа')
                    query.fullname = newFullname
                }

                !newAbout ? (query.about = '') : (query.about = newAbout)

                if (newUsername) {
                    if (_.trim(newUsername).length < 4) return reject('Имя пользователя должно содержать более 3 символов')
                    await UserController.isUsernameIsFree(newUsername)
                        .then((onResolved: any) => {
                            if (!onResolved) return reject('Имя занято')
                            query.username = newUsername
                        })
                        .catch((err: any) => reject(err))
                }

                if (newPassword) {
                    if (_.trim(newPassword).length < 4) return reject('Пароль должен содержать более 3 символов')
                    await bcrypt.hash(newPassword, 10).then(
                        (hash: any) => (query.password = hash),
                        (error: any) => res.send({ status: 'error', error })
                    )
                }
                UserModel.updateOne({ _id: req.auth.user_id }, { $set: query }, (error: any, result: any) => {
                    if (error) return reject(error)
                    jwt.sign({ username: newUsername ? newUsername : oldUsername, user_id: req.auth.user_id }, Config.JWT_KEY, (err: any, token: any) => {
                        res.setHeader(
                            'Set-Cookie',
                            cookie.serialize('token', token, {
                                maxAge: 60 * 60 * 24 * 7,
                                path: '/',
                            })
                        )
                        resolve()
                    })
                })
            })
        }).then(response => res.send({ status: 'ok' })).catch(error => res.send({ status: 'error', error }))
    }

    public getUserByUsername(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const { username } = req.params
            UserModel.findOne({ username: username }, { password: 0 }, (error: any, doc: any) => {
                if (error) return reject(error)
                doc &&
                    doc.posts.sort((a: any, b: any) => {
                        if (a.timestamp > b.timestamp) {
                            return -1
                        } else {
                            return 1
                        }
                    })
                resolve(doc)
            })
        }).then(user => res.send({ user: user })).catch(error => res.send({ status: 'error', error }))
    }

    public getUserIdByUsername(username: String) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ username })
                .then((res: any) => resolve(res._id))
                .catch((err: any) => reject('Error'))
        })
    }

    public subscribeToUser(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const { usernameToSubscribeID } = req.body
            const usernameID = req.auth.user_id
            UserModel.findOne({ _id: usernameID }, function (error: any, doc: any) {
                const { subscriptions } = doc
                if (subscriptions.includes(usernameToSubscribeID)) return res.send({ status: 'error', error: 'Already subscribed' })
                UserModel.updateOne({ _id: usernameID }, { $push: { subscriptions: usernameToSubscribeID } }, (error: any) => {
                    if (error) return res.send({ status: 'error', error })
                    UserModel.updateOne(
                        { _id: usernameToSubscribeID },
                        { $push: { subscribers: usernameID, }, }, (error: any) => {
                            if (error) return reject(error)
                            resolve()
                        }
                    )
                })
            })
        }).then(response => res.send({ status: 'ok' })).catch(error => res.send({ status: 'error', error }))
    }

    public unSubscribeFromUser(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const { usernameToSubscribeID } = req.body
            const usernameID = req.auth.user_id
            UserModel.updateOne(
                { _id: usernameID },
                { $pull: { subscriptions: usernameToSubscribeID }, },
                (error: any) => {
                    if (error) return reject(error)
                    UserModel.updateOne(
                        { _id: usernameToSubscribeID },
                        { $pull: { subscribers: usernameID, }, },
                        (error: any) => {
                            if (error) return reject(error)
                            resolve()
                        }
                    )
                })
        }).then(response => res.send({ status: 'ok' })).catch(error => res.send({ status: 'error', error }))
    }

    public getSubscriptionsByUsername(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const { username } = req.params
            UserModel.findOne({ username }, { subscriptions: 1, _id: 0 }, (error: any, doc: any) => {
                if (error) reject(error)
                if (!doc) return resolve([])
                UserModel.find({ _id: { $in: doc.subscriptions } }, { username: 1, avatar: 1, fullname: 1, _id: 0 }, (error: any, docs: any) => {
                    if (error) reject(error)
                    resolve(docs)
                })
            })
        }).then(Arr => res.send({ status: 'ok', subscriptions: Arr })).catch(error => res.send({ status: 'error', error }))
    }

    public getSubscribersByUsername(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const { username } = req.params
            UserModel.findOne({ username }, { subscribers: 1, _id: 0 }, (error: any, doc: any) => {
                if (!doc) return resolve([])
                UserModel.find({ _id: { $in: doc.subscribers } }, { username: 1, avatar: 1, fullname: 1 }, (error: any, docs: any) => {
                    if (error) return reject(error)
                    resolve(docs)
                })
            })
        }).then(Arr => res.send({ subscribers: Arr })).catch(error => res.send({ status: 'error', error }))
    }

    public suggestionsByUsername(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const { username } = req.query
            UserModel.find({ username: { $not: { $eq: username } } }, (error: any, docs: any) => {
                if (error) return reject(error)
                if (docs.length === 0) return resolve([])
                const newArr: any = []
                docs.map((el: any, i: any) => {
                    newArr.push({ username: el.username, fullname: el.fullname, avatar: el.avatar })
                    if (i + 1 == docs.length) {
                        return resolve(newArr.sort(() => Math.random() - 0.5))
                    }
                })
            }).limit(16)
        }).then(Arr => res.send({ suggestions: Arr })).catch(error => res.send({ status: 'error', error }))
    }
}

const UserControllerInstance: UserController = new UserController()

export default UserControllerInstance
