import {Req, Res} from "../interfaces";

const _ = require('lodash')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

import UserModel from '../models/UserModel'
import DialogModel from '../models/DialogModel'

class DialogController {
    public createDialog(req: Req, res: Res) {
        const {users} = req.body
        /* users is an array (2) of users in dialog */
        return new Promise(function (resolve: any, reject: any) {
            /* check if <users> is in some dialog */
            DialogModel.findOne({users: users}, function (err: any, doc: any) {
                if (err) throw err
                if (doc) return resolve(doc._id)
                /* Create dialog */
                new DialogModel({
                    users: users,
                    messages: [],
                    lastVisit: Date.now(),
                }).save(function (err: any, res: any) {
                    if (err) throw err
                    const dialogID = res._id
                    /* Add dialog ID to each user in this dialog (<users>) */
                    UserModel.updateMany({_id: {$in: users}}, {$push: {messages: res._id}}, function (err: any, res: any) {
                        if (err) throw err
                        /* Send dialog ID */
                        resolve(dialogID)
                    })
                })
            })
        }).then(dialogID => res.send({dialogID}))
            .catch(e => res.end({error: e}))
    }

    public async createMessage(roomID: any, message: any, username: any) {
        try {
            await DialogModel.updateOne(
                {_id: roomID},
                {
                    $push: {messages: {message, username, timestamp: Date.now()},},
                    $set: {lastVisit: Date.now(),},
                }
            );
        } catch (e) {
            console.log('DialogController.createMessage error')
        }
    }

    public getDialogsList(req: Req, res: Res) {
        const username = req.auth.username
        const query = req.query.query
        return new Promise((resolve, reject) => {
            UserModel.findOne({username}, {_id: 0}, function (err: any, doc: any) {
                if (err) throw err
                if (doc.messages.length == 0) return resolve([])
                let newArr: any = []
                DialogModel.find({_id: {$in: doc.messages}}, {messages: 0}, async function (err: any, docs: any) {
                    if (err) throw err
                    let i = 0
                    docs.map(async (el: any) => {
                        /* Force every user id to be ObjectId as mongoose requires it */
                        el.users = el.users.map((el: any) => ObjectId(el))
                        /* If query, searching with Regular Expression */
                        if (query) {
                            await UserModel.findOne(
                                {
                                    $and: [{_id: {$in: el.users}}, {username: {$ne: username}}, {
                                        username: {
                                            $regex: query,
                                            $options: 'i'
                                        }
                                    }]
                                },
                                {username: 1, avatar: 1, _id: 0},
                                function (err: any, res: any) {
                                    if (err) return reject(err)
                                    if (res) newArr = newArr.concat({
                                        username: res.username,
                                        dialogID: el._id,
                                        avatar: res.avatar,
                                        lastVisit: el.lastVisit
                                    })
                                }
                            )
                        } else {
                            await UserModel.findOne({$and: [{_id: {$in: el.users}}, {username: {$ne: username}}]}, {
                                username: 1,
                                avatar: 1,
                                _id: 0
                            }, function (err: any, res: any) {
                                if (err) return reject(err)
                                if (res) newArr = newArr.concat({
                                    username: res.username,
                                    dialogID: el._id,
                                    avatar: res.avatar,
                                    lastVisit: el.lastVisit
                                })
                            })
                        }
                        if (i + 1 == docs.length) {
                            /* Sort by lastVisit field to show newest dialogs */
                            newArr.sort(function (a: any, b: any) {
                                if (a.lastVisit > b.lastVisit) return -1
                                return 1
                            })
                            return resolve(newArr)
                        } else i++
                    })
                })
            })
        }).then(dialogs => res.send({dialogs}))
            .catch(error => res.send({error}))
    }

    public getDialog(req: Req, res: Res) {
        const {dialogID} = req.query
        const {username} = req.auth
        return new Promise((resolve, reject) => {
            DialogModel.findOne({_id: dialogID}, {messages: 1, _id: 0, users: 1}, function (err: any, res: any) {
                if (err) throw err
                if (!res) return resolve([])
                let newObj = {
                    messages: res.messages,
                    users: Array,
                }
                res.users = res.users.map((el: any) => ObjectId(el))
                UserModel.find({_id: res.users}, function (err: any, docs: any) {
                    newObj.users = docs
                    return resolve(newObj)
                })
            })
        }).then(dialog => res.send({dialog}))
            .catch(error => res.send({error}))
    }
}

const DialogControllerInstance: DialogController = new DialogController()

export default DialogControllerInstance
