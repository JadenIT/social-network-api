const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const _ = require('lodash')
const {ObjectId} = require('mongodb');

import UserModel from '../models/UserModel'
import {Res, Req, User} from '../interfaces/index'
import Config from '../config'
import upload from '../middlewares/storage'

class UserController {
    static async isUsernameIsFree(username: String) {
        try {
            const isFree = await UserModel.findOne({username});
            if (isFree) {
                return false
            }
            return true
        } catch (e) {

        }
    }

    public logout(req: Req, res: Res) {
        res.setHeader(
            'Set-Cookie',
            cookie.serialize('token', null, {
                maxAge: 0,
                path: '/',
            })
        )
        res.send({status: 'ok'})
    }

    public async createUser(req: Req, res: Res) {
        try {
            const {fullName, username, password} = req.body

            if (!_.trim(username) || !_.trim(password) || !_.trim(fullName)) return res.send({
                status: 'error',
                error: 'Не все поля заполнены'
            });

            if (_.trim(username).length < 4) return res.send({
                status: 'error',
                error: 'Имя пользователя должно содержать более 3 символов'
            });

            if (_.trim(password).length < 4) return res.send({
                status: 'error',
                error: 'Пароль должен содержать более 3 символов'
            })

            if (_.trim(fullName).length < 2) return res.send({
                status: 'error',
                error: 'Имя и фамилия должны содержать более 1 символа'
            })

            const isUsernameFree = await UserController.isUsernameIsFree(username);
            if (!isUsernameFree) return res.send({status: 'error', error: 'Имя занято'})

            const hash = await bcrypt.hash(password, 10);
            const userModelInstance = new UserModel({fullname: fullName, username: username, password: hash})

            const doc = await userModelInstance.save();
            const token = jwt.sign({user_id: doc._id, username}, Config.JWT_KEY);

            res.setHeader(
                'Set-Cookie',
                cookie.serialize('token', token, {
                    maxAge: 60 * 60 * 24 * 7,
                    path: '/',
                })
            );

            res.send({status: 'ok'});
        } catch (e) {
            res.send({status: 'error', e})
        }
    }

    public async updateUser(req: Req, res: Res) {
        try {
            upload(req, res, async (err: Error) => {
                if (err) return res.send({
                    status: 'Error',
                    error: 'Произошла ошибка, скорее всего файл слишком большой'
                })
                const {oldUsername, newUsername, newPassword, newAbout, newFullname} = req.body
                const fileURL = req.files[0] ? req.files[0].location : null
                let query: User = {}
                if (fileURL) query.avatar = fileURL.toString('base64')
                if (newFullname) {
                    if (_.trim(newFullname).length < 2) return res.send({
                        status: "Error",
                        error: 'Имя и фамилия должны содержать более 1 символа'
                    })
                    query.fullname = newFullname
                }

                !newAbout ? (query.about = '') : (query.about = newAbout)

                if (newUsername) {
                    if (_.trim(newUsername).length < 4) return res.send({
                        status: 'Error',
                        error: 'Имя пользователя должно содержать более 3 символов'
                    })
                    const isUsernameFree = await UserController.isUsernameIsFree(newUsername);
                    if (!isUsernameFree) return res.send({status: "Error", error: 'Имя занято'});
                    query.username = newUsername
                }

                if (newPassword) {
                    if (_.trim(newPassword).length < 4) return res.send({
                        status: "Error",
                        error: 'Пароль должен содержать более 3 символов'
                    })
                    query.password = await bcrypt.hash(newPassword, 10);
                }
                await UserModel.updateOne({_id: req.auth.user_id}, {$set: query});


                const token = jwt.sign({
                    username: newUsername ? newUsername : oldUsername,
                    user_id: req.auth.user_id
                }, Config.JWT_KEY);

                res.setHeader(
                    'Set-Cookie',
                    cookie.serialize('token', token, {
                        maxAge: 60 * 60 * 24 * 7,
                        path: '/',
                    })
                )
                res.send({status: 'ok'})
            })
        } catch
            (e) {
            res.send({status: 'Error'})
        }
    }

    public async getUserByUsername(req: Req, res: Res) {
        try {
            const {username} = req.params
            const doc = await UserModel.findOne({username: username}, {password: 0});
            doc && doc.posts.sort((a: any, b: any) => {
                if (a.timestamp > b.timestamp) {
                    return -1
                } else {
                    return 1
                }
            })
            res.send({user: doc})
        } catch (e) {
            res.send({status: 'Error'})
        }
    }

    public async getUserIdByUsername(username: String) {
        try {
            const {_id} = await UserModel.findOne({username});
            return _id
        } catch (e) {

        }
    }

    public async subscribeToUser(req: Req, res: Res) {
        try {
            const {user_id} = req.body
            const usernameID = req.auth.user_id
            const {subscriptions} = await UserModel.findOne({_id: usernameID});
            if (subscriptions.includes(user_id)) return res.send({status: 'error', error: 'Already subscribed'})
            await UserModel.updateOne({_id: usernameID}, {$push: {subscriptions: ObjectId(user_id)}});
            await UserModel.updateOne({_id: user_id}, {$push: {subscribers: ObjectId(usernameID),}});
            res.send({status: 'ok'})
        } catch (e) {
            res.send({status: 'Error'})
        }
    }

    public async unSubscribeFromUser(req: Req, res: Res) {
        try {
            const {user_id} = req.body;
            const usernameID = req.auth.user_id;
            await UserModel.updateOne({_id: usernameID}, {$pull: {subscriptions: user_id},});
            await UserModel.updateOne({_id: user_id}, {$pull: {subscribers: usernameID,},});
            res.send({status: 'ok'});
        } catch (e) {
            res.send({status: 'Error'})
        }
    }

    public async getSubscriptionsByUsername(req: Req, res: Res) {
        try {
            const {username} = req.params
            const doc = await UserModel.findOne({username}, {subscriptions: 1, _id: 0});
            if (!doc) return res.send({subscriptions: []})
            const docs = await UserModel.find({_id: {$in: doc.subscriptions}}, {
                username: 1,
                avatar: 1,
                fullname: 1,
                _id: 0
            })
            res.send({subscriptions: docs})
        } catch (e) {
            res.send({status: 'Error'})
        }
    }

    public async getSubscribersByUsername(req: Req, res: Res) {
        try {
            const {username} = req.params
            const doc = await UserModel.findOne({username}, {subscribers: 1, _id: 0});
            if (!doc) return res.send({subscribers: []})
            const docs = await UserModel.find({_id: {$in: doc.subscribers}}, {
                username: 1,
                avatar: 1,
                fullname: 1
            });
            res.send({subscribers: docs})
        } catch (e) {
            res.send({status: 'Error'})
        }
    }

    public async suggestionsByUsername(req: Req, res: Res) {
        try {
            const {username} = req.query
            const docs = await UserModel.find({username: {$not: {$eq: username}}}).limit(16);
            if (docs.length === 0) return res.send({suggestions: []})
            const newArr: any = []
            docs.map((el: any, i: any) => {
                newArr.push({username: el.username, fullname: el.fullname, avatar: el.avatar})
                if (i + 1 == docs.length) {
                    return res.send({suggestions: newArr.sort(() => Math.random() - 0.5)})
                }
            })
        } catch (e) {
            res.send({status: 'Error'})
        }
    }
}

const UserControllerInstance: UserController = new UserController()

export default UserControllerInstance
