import UserModel from '../models/UserModel'
const uniqid = require('uniqid')

class DialogController {
    public createDialog(users: Array<String>) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ 'messages.users': { $all: users } })
                .then((response: any) => {
                    if (response) return resolve(response.messages[0].dialogID)

                    const dialogID = uniqid()
                    UserModel.updateMany({ _id: { $in: users } }, { $push: { messages: { lastVisit: Date.now(), dialogID: dialogID, users: users, messages: [] } } })
                        .then((doc: any) => {
                            resolve(dialogID)
                        })
                        .catch((error: any) => reject(error))
                })
                .catch((error: any) => reject(error))
        })
    }

    private updateDialogLastVisit(dialogID: any, date: any) {
        return new Promise((resolve, reject) => {
            UserModel.updateOne({ 'messages.dialogID': dialogID }, { $set: { 'messages.$.lastVisit': Date.now() } })
                .then((res: any) => resolve())
                .catch((err: any) => reject(err))
        })
    }

    public createMessage(username: String, message: String, roomID: any) {
        return new Promise((resolve, reject) => {
            UserModel.updateMany({ 'messages.dialogID': roomID }, { $push: { 'messages.$.messages': { message: message, username: username, timestamp: Date.now() } } })
                .then((res: any) => {
                    this.updateDialogLastVisit(roomID, Date.now())
                        .then((res) => resolve())
                        .catch((err) => reject(err))
                })
                .catch((error: any) => reject(error))
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
                            messages.sort((a: any, b: any) => {
                                if (a.lastVisit > b.lastVisit) {
                                    return -1
                                } else {
                                    return 1
                                }
                            })
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
                                        if (!query) return resolve(newArr)
                                        let queriedArr: any = []
                                        newArr.map((el: any, j: any) => {
                                            if (el.username.match(new RegExp(query, 'g'))) queriedArr.push(el)

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
    }
}

const DialogControllerInstance: DialogController = new DialogController()

export default DialogControllerInstance
