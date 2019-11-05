import UserModel from '../models/UserModel'
const jwt = require('jsonwebtoken')
const uniqid = require('uniqid')

class DialogController {
    public createDialog(users: Array<String>, token: String) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error: any, decoded: any) => {
                if (error) return reject(error)
                if (!decoded) return reject('Not authorized')
                UserModel.findOne({ 'messages.users': { $all: users } })
                    .then((response: any) => {
                        if (response) return resolve(response.messages[0].dialogID)

                        const dialogID = uniqid()
                        UserModel.updateMany({ _id: { $in: users } }, { $push: { messages: { dialogID: dialogID, users: users, messages: [] } } })
                            .then((doc: any) => {
                                resolve(dialogID)
                            })
                            .catch((error: any) => reject(error))
                    })
                    .catch((error: any) => reject(error))
            })
        })
    }

    public createMessage(username: String, message: String, roomID: any, token: String) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error: any, decoded: any) => {
                if (error) return reject(error)
                if (!decoded) return reject('Not authorized')
                if (username != decoded.username) return reject("Token username doesn't match username from req")
                UserModel.updateMany({ 'messages.dialogID': roomID }, { $push: { 'messages.$.messages': { message: message, username: username, timestamp: Date.now() } } })
                    .then((res: any) => {
                        resolve()
                    })
                    .catch((error: any) => reject(error))
            })
        })
    }

    public getMessages(username: String, token: String) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error: any, decoded: any) => {
                if (error) return reject(error)
                if (!decoded) return reject('Not authorized')
                if (decoded.username != username) return reject("Token username doesn't match username from req")

                UserModel.findOne({ username: username }, { messages: 1 })
                    .then(async (res: any) => {
                        let messages = res.messages
                        if (messages.length == 0) return resolve([])
                        for (let i = 0; i < messages.length; i++) {
                            await UserModel.find({ _id: { $in: messages[i].users } }, { username: 1, avatar: 1, _id: 0 })
                                .then((res: any) => (messages[i].users = res))
                                .catch((error: any) => reject(error))
                            if (i + 1 == messages.length) return resolve(messages)
                        }
                    })
                    .catch((error: any) => {
                        reject(error)
                    })
            })
        })
    }

    public getDialog(dialogID: any, token: String) {
        const self = this
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error: any, decoded: any) => {
                if (error) return reject(error)
                if (!decoded) return reject('!decoded')
                UserModel.findOne({ 'messages.dialogID': dialogID }, { messages: 1, _id: 0 })
                    .then((res: any) => {
                        res.messages.map((el: any) => {
                            if (el.dialogID == dialogID) {
                                UserModel.find({ _id: { $in: el.users } }, { avatar: 1, _id: 0, username: 1 }).then((res: any) => {
                                    el.users_2 = res
                                    return resolve(el)
                                })
                            }
                        })
                    })
                    .catch((error: any) => reject(error))
            })
        })
    }
}

const DialogControllerInstance: DialogController = new DialogController()

export default DialogControllerInstance
