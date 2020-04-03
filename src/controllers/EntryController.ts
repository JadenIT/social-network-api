const uniqid = require('uniqid')
const ObjectId = require('mongodb').ObjectID

import { Res, Req } from '../interfaces/index'
import upload from '../middlewares/storage'
import UserController from './UserController'
import UserModel from '../models/UserModel'

class EntryController {
    public create(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            upload(req, res, (err: any) => {
                if (err) return reject('Произошла ошибка, скорее всего файл слишком большой')
                const username = req.auth.username
                const fileURL = req.files[0] ? req.files[0].location : null
                UserController.getUserIdByUsername(username).then(_id => {
                    UserModel.updateOne(
                        { username: username },
                        { $push: { posts: { author: _id, _id: uniqid(), text: req.body.text, username, timestamp: Date.now(), likedBy: [], fileURL } } },
                        (err: any, result: any) => {
                            if (err) return reject(err)
                            resolve()
                        }
                    )
                })
            })
        })
            .then(response => res.send({ status: 'ok' }))
            .catch(error => res.send({ status: 'error', error }))
    }

    public like(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const { usernamePostedPostId, postID } = req.body
            const usernameID = req.auth.user_id
            UserModel.find(
                {
                    $and: [{ _id: { $eq: usernamePostedPostId } }, { 'posts._id': { $eq: postID } }, { 'posts.likedBy._id': { $eq: usernameID } }],
                },
                { posts: 1 },
                (err: any, doc: any) => {
                    if (err) reject(err)
                    if (doc && doc.lingth > 0) return reject('Already liked')
                    UserModel.updateOne(
                        {
                            $and: [{ _id: { $eq: usernamePostedPostId } }, { 'posts._id': { $eq: postID } }],
                        },
                        { $push: { 'posts.$.likedBy': { _id: usernameID } } },
                        (err: any, doc: any) => {
                            if (err) reject('err')
                            UserModel.updateOne({ _id: usernameID }, { $push: { favorites: postID } })
                                .then((doc: any) => {
                                    resolve()
                                })
                                .catch((err: any) => reject(err))
                        }
                    )
                }
            )
        })
            .then(response => res.send({ status: 'ok' }))
            .catch(error => res.send({ status: 'error', error }))
    }

    public dislike(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const { usernamePostedPostID, postID } = req.body
            const usernameID = req.auth.user_id
            UserModel.updateOne({ _id: { $eq: usernamePostedPostID }, 'posts._id': { $eq: postID } }, { $pull: { 'posts.$.likedBy': { _id: usernameID } } }, (err: any, doc: any) => {
                if (err) reject(err)
                UserModel.updateOne({ _id: usernameID }, { $pull: { favorites: postID } }, (err, doc) => {
                    resolve()
                })
            })
        })
            .then(response => res.send({ status: 'ok' }))
            .catch(error => res.send({ status: 'error', error }))
    }

    public delete(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const username = req.auth.username
            const { postID } = req.body
            UserModel.updateOne({ username }, { $pull: { posts: { _id: postID } } })
                .then((doc: any) => {
                    resolve(postID)
                })
                .catch((err: any) => reject(err))
        })
            .then(postID => res.send({ status: 'ok', deletedPost: postID }))
            .catch(error => res.send({ status: 'error', error }))
    }

    public favorites(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const user_id = req.auth.user_id
            UserModel.findOne({ _id: user_id }, (err, doc) => {
                UserModel.aggregate([{ $unwind: '$posts' }, { $match: { 'posts._id': { $in: doc.favorites } } }], (err, docs) => {
                    if (err) reject(err)
                    resolve(docs)
                })
            })
        })
            .then(data => {
                res.send({ status: 'ok', data })
            })
            .catch(error => res.send({ status: 'error', error }))
    }
}

const EntryControllerInstance: EntryController = new EntryController()

export default EntryControllerInstance
