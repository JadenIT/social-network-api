const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
import UserModel from '../models/UserModel'
import { Request, Response } from 'express'
import Config from '../config/index'
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

    public logout(req: Request, res: Response) {
        res.setHeader(
            'Set-Cookie',
            cookie.serialize('token', null, {
                maxAge: 0,
                path: '/',
            })
        )
        res.send({ status: 'ok' })
    }

    public createUser(req: Request, res: Response) {
        try {
            const { fullName, username, password } = req.body
            if (!username) return res.send({ status: 'error', error: 'Имя пользователяне заполнено' })
            if (!password) return res.send({ status: 'error', error: 'Пароль не заполнен' })
            if (!fullName) return res.send({ status: 'error', error: 'Имя не заполнено' })
            UserController.isUsernameIsFree('username')
                .then(isFree => {
                    if (!isFree) return res.send({ status: 'error', error: 'Имя занято' })
                    bcrypt
                        .hash(password, 10)
                        .then((hash: String) => {
                            const userModelInstance = new UserModel({ fullname: fullName, username: username, password: hash })
                            userModelInstance
                                .save()
                                .then((doc: any) => {
                                    jwt.sign({ user_id: doc._id, username }, Config.JWT_KEY, (err: any, token: any) => {
                                        res.setHeader(
                                            'Set-Cookie',
                                            cookie.serialize('token', token, {
                                                maxAge: 60 * 60 * 24 * 7,
                                                path: '/',
                                            })
                                        )
                                        res.send({ status: 'ok' })
                                    })
                                })
                                .catch((error: any) => res.send({ status: 'error', error }))
                        })
                        .catch((error: any) => res.send({ status: 'error', error }))
                })
                .catch(error => res.send({ status: 'error', error }))
        } catch (error) {
            res.send({ status: 'error', error })
        }
    }

    public updateUser(req: Request, res: Response) {
        try {
            upload(req, res, async (err: Error) => {
                if (err) return res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' })
                const { oldUsername, newUsername, newPassword, newAbout, newFullname } = req.body
                const fileURL = req.files[0] ? req.files[0].location : null
                let query = {}
                if (fileURL) query.avatar = fileURL.toString('base64')
                if (newFullname) query.fullname = newFullname
                query.about = newAbout
                if (!newAbout) {
                    query.about = ''
                } else {
                    query.about = newAbout
                }

                if (newUsername) {
                    await UserController.isUsernameIsFree(newUsername)
                        .then((onResolved: any) => {
                            if (!onResolved) return res.send({ status: 'error', error: 'Имя занято' })
                            query.username = newUsername
                        })
                        .catch((err: any) => res.send({ status: 'error', err }))
                }

                if (newPassword) {
                    await bcrypt.hash(newPassword, 10).then(
                        (hash: any) => (query.password = hash),
                        (error: any) => res.send({ status: 'error', error })
                    )
                }
                console.log(query)
                UserModel.updateOne({ _id: req.auth.user_id }, query)
                    .then((onResolved: any) => {
                        jwt.sign({ username: newUsername ? newUsername : oldUsername, user_id: req.auth.user_id }, Config.JWT_KEY, (err: any, token: any) => {
                            res.setHeader(
                                'Set-Cookie',
                                cookie.serialize('token', token, {
                                    maxAge: 60 * 60 * 24 * 7,
                                    path: '/',
                                })
                            )
                            res.send({ status: 'ok' })
                        })
                    })
                    .catch((error: any) => res.send({ status: 'error', error }))
            })
        } catch (error) {
            res.send({ status: 'error', error })
        }
    }

    public getUserByUsername(req: Request, res: Response) {
        try {
            const { username } = req.params
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
                    about: 1,
                },
                (error: any, doc: any) => {
                    if (error) return res.send({ status: 'error', error })
                    doc &&
                        doc.posts.sort((a: any, b: any) => {
                            if (a.timestamp > b.timestamp) {
                                return -1
                            } else {
                                return 1
                            }
                        })
                    res.send({ user: doc })
                }
            )
        } catch (error) {
            res.send({ status: 'error', error })
        }
    }

    public getUserIdByUsername(username: String) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ username })
                .then((res: any) => resolve(res._id))
                .catch((err: any) => reject('Error'))
        })
    }

    public subscribeToUser(req: Request, res: Response) {
        try {
            const { usernameToSubscribeID } = req.body
            const usernameID = req.auth.user_id
            UserModel.findOne({ _id: usernameID }, function(error: any, doc: any) {
                const { subscriptions } = doc

                if (subscriptions.includes(usernameToSubscribeID)) return res.send({ status: 'error', error: 'Already subscribed' })

                UserModel.updateOne({ _id: usernameID }, { $push: { subscriptions: usernameToSubscribeID } }, (error: any) => {
                    if (error) return res.send({ status: 'error', error })
                    UserModel.updateOne(
                        { _id: usernameToSubscribeID },
                        {
                            $push: {
                                subscribers: usernameID,
                            },
                        },
                        (error: any) => {
                            if (error) return res.send({ status: 'error', error })
                            res.send({ status: 'ok' })
                        }
                    )
                })
            })
        } catch (error) {
            res.send({ status: 'error', error })
        }
    }

    public unSubscribeFromUser(req: Request, res: Response) {
        try {
            const { usernameToSubscribeID } = req.body
            const usernameID = req.auth.user_id
            UserModel.updateOne(
                { _id: usernameID },
                {
                    $pull: {
                        subscriptions: usernameToSubscribeID,
                    },
                },
                (error: any) => {
                    if (error) return res.send({ status: 'error', error })
                    UserModel.updateOne(
                        { _id: usernameToSubscribeID },
                        {
                            $pull: {
                                subscribers: usernameID,
                            },
                        },
                        (error: any) => {
                            if (error) throw error
                            res.send({ status: 'ok' })
                        }
                    )
                }
            )
        } catch (error) {
            res.send({ status: 'error', error })
        }
    }

    public getSubscriptionsByUsername(req: Request, res: Response) {
        try {
            const { username } = req.params
            UserModel.findOne({ username }, { subscriptions: 1, _id: 0 })
                .then((result: any) => {
                    if (!result) return res.send([])
                    UserModel.find({ _id: { $in: result.subscriptions } }, { username: 1, avatar: 1, fullname: 1, _id: 0 })
                        .then((result: any) => res.send({ status: 'ok', subscriptions: result }))
                        .catch((error: any) => res.send({ status: 'error', error }))
                })
                .catch((error: any) => res.send({ status: 'error', error }))
        } catch (error) {
            res.send({ status: 'error', error })
        }
    }

    public getSubscribersByUsername(req: Request, res: Response) {
        try {
            const { username } = req.params
            UserModel.findOne({ username }, { subscribers: 1, _id: 0 })
                .then((result: any) => {
                    if (!result) return res.send([])
                    UserModel.find({ _id: { $in: result.subscribers } }, { username: 1, avatar: 1, fullname: 1, _id: 0 })
                        .then((result: any) => res.send({ status: 'ok', subscribers: result }))
                        .catch((error: any) => res.send({ status: 'error', error }))
                })
                .catch((error: any) => res.send({ status: 'error', error }))
        } catch (error) {
            res.send({ status: 'error', error })
        }
    }

    public suggestionsByUsername(req: Request, res: Response) {
        try {
            const { username } = req.query
            UserModel.aggregate(
                [
                    {
                        $match: {
                            $and: [{ username: { $not: { $eq: username } } }],
                        },
                    },
                    {
                        $sort: {
                            subscribers: -1,
                        },
                    },
                ],
                (error: any, docs: any) => {
                    if (error) return res.send({ status: 'error', error })
                    if (docs.length === 0) return res.send([])
                    const newArr: any = []
                    docs.map((el: any, i: any) => {
                        newArr.push({ username: el.username, fullname: el.fullname, avatar: el.avatar })
                        if (i + 1 == docs.length) return res.send({ suggestions: newArr })
                    })
                }
            ).limit(10)
        } catch (error) {
            res.send({ status: 'error', error })
        }
    }
}

const UserControllerInstance: UserController = new UserController()

export default UserControllerInstance
