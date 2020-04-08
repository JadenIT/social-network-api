import {Req, Res} from "../interfaces";

const _ = require('lodash')
const mongoose = require('mongoose')
const {ObjectId} = require('mongodb');

import UserModel from '../models/UserModel'
import DialogModel from '../models/DialogModel'

class DialogController {

    public async createDialog(req: Req, res: Res) {
        let {users} = req.body;
        users = await users.map((el: any) => ObjectId(el))
        try {
            const doc = await DialogModel.findOne({users: users});
            console.log(doc)
            if (doc) return res.send({dialogID: doc._id});
            await new DialogModel({
                users: users,
                messages: [],
                lastVisit: Date.now(),
            }).save(async (err: any, result: any) => {
                const dialogID = result._id;
                await UserModel.updateMany({_id: {$in: users}}, {$push: {messages: dialogID}});
                res.send({dialogID: dialogID});
            })
        } catch (e) {
            res.end({error: e})
        }
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

    public async getDialogsList(req: Req, res: Res) {
        const {user_id} = req.auth
        const query = req.query.query
        try {
            const {messages} = await UserModel.findOne({_id: user_id}, {_id: 0, messages: 1});
            let aggregateParams = [
                {$match: {_id: {$in: messages}}},
                {$unwind: '$users'},
                {$match: {users: {$not: {$eq: ObjectId(user_id)}}}},
                {
                    $lookup: {
                        from: "users",
                        localField: "users",
                        foreignField: '_id',
                        as: "userInfo"
                    }
                },
                {$unwind: '$userInfo'},
                {$match: {'userInfo.username': {$regex: query}}},
                {$unset: ['users', 'messages', 'userInfo.posts', 'userInfo.messages', 'userInfo.password']},
                {$sort: {lastVisit: -1}}
            ]
            const dialogs = await DialogModel.aggregate(aggregateParams);
            res.send({dialogs: dialogs})
        } catch (e) {
            res.send({e})
        }
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

const
    DialogControllerInstance: DialogController = new DialogController()

export default DialogControllerInstance
