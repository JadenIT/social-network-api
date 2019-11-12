const _ = require('lodash')
const uniqid = require('uniqid')
import UserModel from '../models/UserModel'

class DialogController {
    public createDialog(users: any) {
        return new Promise((resolve, reject) => {
            UserModel.find({ 'messages.users': { $eq: users } })
                .then((response: any) => {
                    if (response.length > 0) {
                        response.map((el: any, k: any) => {
                            el.messages.map((el: any) => {
                                if (_.isEqual(el.users.sort(), users.sort())) return resolve(el.dialogID)
                            })
                        })
                    } else {
                        const dialogID = uniqid()
                        UserModel.updateMany({ _id: { $in: users } }, { $push: { messages: { lastVisit: Date.now(), dialogID: dialogID, users, messages: [] } } }, function(err: any, doc: any) {
                            if (err) return reject(err)
                            resolve(dialogID)
                        })
                    }
                })
                .catch((error: any) => reject(error))
        })
    }

    public createMessage(username: String, message: String, roomID: any) {
        return new Promise((resolve, reject) => {
            UserModel.updateMany({ 'messages.dialogID': roomID }, { $push: { 'messages.$.messages': { message: message, username: username, timestamp: Date.now() } } }, function(err: any, res: any) {
                if (err) return reject(err)
                UserModel.updateMany({ 'messages.dialogID': roomID }, { $set: { 'messages.$.lastVisit': Date.now() } }, function(err: any, res: any) {
                    if (err) return reject(err)
                    resolve(res)
                })
            })
        })
    }

    public getMessages(username: String, query: any) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ username: username }, { messages: 1 })
                .then(async (res: any) => {
                    let messages = res.messages
                    if (messages.length == 0) return resolve([])
                    for (let i = 0; i < messages.length; i++) {
                        await UserModel.find({ _id: { $in: messages[i].users } }, { username: 1, avatar: 1, _id: 0 })
                            .then((res: any) => (messages[i].users = res))
                            .catch((error: any) => reject(error))
                        if (i + 1 == messages.length) {
                            let newArr: any = []
                            messages.map((el: any, i: any) => {
                                el.users.map((el2: any) => {
                                    if (el2.username != username)
                                        newArr.push({
                                            lastVisit: el.lastVisit,
                                            dialogID: el.dialogID,
                                            username: el2.username,
                                            avatar: el2.avatar
                                        })
                                    if (i + 1 == messages.length) {
                                        newArr.sort((a: any, b: any) => {
                                            if (a.lastVisit > b.lastVisit) {
                                                return -1
                                            } else {
                                                return 1
                                            }
                                        })
                                        if (!query) return resolve(newArr)
                                        let queriedArr: any = []
                                        newArr.map((el: any, j: any) => {
                                            if (el.username.match(new RegExp(query, 'i'))) queriedArr.push(el)

                                            if (j + 1 == newArr.length) return resolve(queriedArr)
                                        })
                                    }
                                })
                            })
                        }
                    }
                })
                .catch((error: any) => reject(error))
        })
    }

    public getDialog(dialogID: any) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ 'messages.dialogID': dialogID }, { messages: 1, _id: 0 }, function(err: any, res: any) {
                res.messages.map((el: any) => {
                    if (el.dialogID == dialogID) {
                        UserModel.find({ _id: { $in: el.users } }, { avatar: 1, _id: 0, username: 1 }, function(err: any, res: any) {
                            if (err) return reject(err)
                            el.users_2 = res
                            return resolve(el)
                        })
                    }
                })
            })
        })
    }
}

const DialogControllerInstance: DialogController = new DialogController()

export default DialogControllerInstance
