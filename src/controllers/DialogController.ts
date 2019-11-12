const _ = require('lodash')
const uniqid = require('uniqid')
import UserModel from '../models/UserModel'
import DialogModel from '../models/DialogModel'
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class DialogController {
    public createDialog(users: Array<String>) {
        /* users is an array (2) of users in dialog */
        return new Promise(function(resolve: any, reject: any) {
            /* check if <users> is in some dialog */
            DialogModel.findOne({ users: users }, function(err: any, doc: any) {
                if (err) throw err
                if (doc) return resolve(doc._id)
                /* Create dialog */
                new DialogModel({
                    users: users,
                    messages: [],
                    lastVisit: Date.now(),
                }).save(function(err: any, res: any) {
                    if (err) throw err
                    const dialogID = res._id
                    /* Add dialog ID to each user in this dialog (<users>) */
                    UserModel.updateMany({ _id: { $in: users } }, { $push: { messages: res._id } }, function(err: any, res: any) {
                        if (err) throw err
                        /* Send dialog ID */
                        resolve(dialogID)
                    })
                })
            })
        })
    }

    public createMessage(username: String, message: String, roomID: any) {
        return new Promise((resolve, reject) => {
            DialogModel.updateOne(
                { _id: roomID },
                {
                    $push: {
                        messages: { message, username, timestamp: Date.now() },
                    },
                },
                function(err: any, res: any) {
                    if (err) throw err
                    DialogModel.updateOne({ _id: roomID }, { $set: { lastVisit: Date.now() } }, function(err: any, res: any) {
                        if (err) reject(err)
                        resolve()
                    })
                }
            )
        })
    }

    public getMessages(username: String, query: any) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ username }, { _id: 0 }, function(err: any, doc: any) {
                if (err) throw err
                if (doc.messages.length == 0) return resolve([])
                DialogModel.aggregate([{ $match: { _id: { $in: doc.messages } } }, { $unset: ['messages', '__v'] }], async function(err: any, docs: any) {
                    if (err) throw err
                    let newArr: any = []

                    docs.map(async (el: any, i: any) => {
                        el.users = el.users.map((el: any) => ObjectId(el))
                        await UserModel.findOne(
                            { $and: [{ _id: { $in: el.users } }, { username: { $ne: username } }, { username: { $regex: query, $options: 'i' } }] },
                            { username: 1, avatar: 1, _id: 0 },
                            function(err: any, res: any) {
                                if (!res) return resolve([])
                                newArr = newArr.concat(res)
                                el.dialogID = el._id
                                el.username = res.username
                                el.avatar = res.avatar
                                delete el.users
                            }
                        )
                        if (i + 1 == docs.length) return resolve(docs)
                    })
                })
            })
        })
    }

    public getDialog(dialogID: any) {
        return new Promise((resolve, reject) => {
            DialogModel.findOne({ _id: dialogID }, { messages: 1, _id: 0, users: 1 }, function(err: any, res: any) {
                if (err) throw err
                if (!res) return resolve([])
                res.users = res.users.map((el: any) => ObjectId(el))
                UserModel.find({ _id: { $in: res.users } }, { password: 0 }, function(err: any, docs: any) {
                    res.users = docs
                    resolve(res)
                })
            })
        })
    }
}

const DialogControllerInstance: DialogController = new DialogController()

export default DialogControllerInstance
