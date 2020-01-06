const uniqid = require('uniqid')
import { Request, Response } from 'express'
import upload from '../middlewares/storage'
import UserController from './UserController'
import UserModel from '../models/UserModel'

class EntryController {
    public create(req: Request, res: Response) {
        return new Promise((resolve, reject) => {
            upload(req, res, (err: any) => {
                if (err) return reject('Произошла ошибка, скорее всего файл слишком большой')
                const username = req.auth.username
                const fileURL = req.files[0] ? req.files[0].location : null
                UserController.getUserIdByUsername(username).then(_id => {
                    UserModel.updateOne(
                        { username: username },
                        { $push: { posts: { author: _id, _id: uniqid(), text: req.body.text, username, timestamp: Date.now(), likedBy: [], fileURL }, }, },
                        (err: any, result: any) => {
                            if (err) return reject(err)
                            resolve()
                        })
                })
            })
        }).then(response => res.send({ status: 'ok' })).catch(error => res.send({ status: 'error', error }))
    }

    public like(req: Request, res: Response) {
        return new Promise((resolve, reject) => {
            const { usernamePostedPostId, postID } = req.body
            const usernameID = req.auth.user_id
            UserModel.find(
                { $and: [{ _id: { $eq: { usernamePostedPostId } } }, { 'posts._id': { $eq: postID } }, { 'posts.likedBy._id': { $eq: usernameID } }] },
                { posts: 1 },
                (err: any, doc: any) => {
                    if (err) reject(err)
                    if (doc) return reject('Already liked')
                    UserModel.updateOne(
                        { $and: [{ _id: { $eq: usernamePostedPostId } }, { 'posts._id': { $eq: postID } }] },
                        { $push: { 'posts.$.likedBy': { _id: usernameID } } }, (err: any, doc: any) => {
                            if (err) reject(err)
                            resolve()
                        }
                    )
                }
            )
        }).then(response => res.send({ status: 'ok' })).catch(error => res.send({ status: 'error', error }))
    }

    public dislike(req: Request, res: Response) {
        return new Promise((resolve, reject) => {
            const { usernamePostedPostID, postID } = req.body
            const usernameID = req.auth.user_id
            UserModel.updateOne(
                { _id: { $eq: usernamePostedPostID }, 'posts._id': { $eq: postID } },
                { $pull: { 'posts.$.likedBy': { _id: usernameID } }, }, (err: any, doc: any) => {
                    if (err) reject(err)
                    resolve()
                }
            )
        }).then(response => res.send({ status: 'ok' })).catch(error => res.send({ status: 'error', error }))
    }
}

const EntryControllerInstance: EntryController = new EntryController()

export default EntryControllerInstance
