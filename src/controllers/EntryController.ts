const uniqid = require('uniqid')
import { Request, Response } from 'express'
import upload from '../middlewares/storage'
import UserController from './UserController'
import UserModel from '../models/UserModel'

class EntryController {
    public create(req: Request, res: Response) {
        try {
            upload(req, res, (err: any) => {
                if (err) return res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' })
                const username = req.auth.username
                const fileURL = req.files[0] ? req.files[0].location : null
                UserController.getUserIdByUsername(username).then(_id => {
                    UserModel.updateOne(
                        { username: username },
                        {
                            $push: {
                                posts: { author: _id, _id: uniqid(), text: req.body.text, username, timestamp: Date.now(), likedBy: [], fileURL },
                            },
                        },
                        (err: any, result: any) => res.send({ status: 'ok' })
                    )
                })
            })
        } catch (error) {
            res.send({ status: 'error', error })
        }
    }

    public like(req: Request, res: Response) {
        try {
            const { usernamePostedPostId, postID } = req.body
            const usernameID = req.auth.user_id
            UserModel.find(
                { $and: [{ _id: { $eq: { usernamePostedPostId } } }, { 'posts._id': { $eq: postID } }, { 'posts.likedBy._id': { $eq: usernameID } }] },
                { posts: 1 },
                (error: any, doc: any) => {
                    if (doc) return res.send({ status: 'error', error: 'Already liked' })

                    UserModel.updateOne(
                        { $and: [{ _id: { $eq: usernamePostedPostId } }, { 'posts._id': { $eq: postID } }] },
                        { $push: { 'posts.$.likedBy': { _id: usernameID } } },
                        (error: any, doc: any) => {
                            if (error) throw error
                            res.send({ status: 'ok' })
                        }
                    )
                }
            )
        } catch (error) {
            res.send({ status: 'error', error })
        }
    }

    public dislike(req: Request, res: Response) {
        try {
            const { usernamePostedPostID, postID } = req.body
            const usernameID = req.auth.user_id
            UserModel.updateOne(
                { _id: { $eq: usernamePostedPostID }, 'posts._id': { $eq: postID } },
                {
                    $pull: { 'posts.$.likedBy': { _id: usernameID } },
                },
                (error: any, doc: any) => {
                    if (error) return res.send({ status: 'error', error })
                    res.send({ status: 'ok' })
                }
            )
        } catch (error) {
            res.send({ status: 'error', error })
        }
    }
}

const EntryControllerInstance: EntryController = new EntryController()

export default EntryControllerInstance
