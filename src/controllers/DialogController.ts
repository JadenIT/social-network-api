import {Req, Res} from "../interfaces";

const _ = require('lodash')
const {ObjectId} = require('mongodb');

import UserModel from '../models/UserModel'
import DialogModel from '../models/DialogModel'

class DialogController {

    public async createDialog(req: Req, res: Res) {
        try {
            let {users} = req.body;
            users = await users.map((el: any) => ObjectId(el))
            const doc = await DialogModel.findOne({users: users});
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

    public async getDialog(req: Req, res: Res) {
        try {
            const {dialogID} = req.query;
            const docs = await DialogModel.findOne({_id: dialogID}, {messages: 1, _id: 0, users: 1});
            if (!docs) return res.send({dialog: []});
            let newObj = {
                messages: docs.messages,
                users: Array,
            };
            newObj.users = await UserModel.find({_id: docs.users});
            res.send({dialog: newObj});
        } catch (error) {
            res.send({error});
        }
    }
}

const DialogControllerInstance: DialogController = new DialogController()

export default DialogControllerInstance
