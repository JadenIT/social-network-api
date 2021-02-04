const uniqid = require('uniqid');
const ObjectId = require('mongodb').ObjectID;

import { Res, Req } from '../interfaces/index';
import upload from '../middlewares/storage';
import UserController from './UserController';
import UserModel from '../models/UserModel';
import { saveFile } from './GoogleCloud'

class EntryController {
    public async create(req: Req, res: Res) {
        try {
            let fileURL = null
            if (req.files['file']) {
                let time = new Date().getTime()
                fileURL = time.toString() + req.files['file']['name']
                saveFile(req.files['file']['data'], fileURL)
            }


            const username = req.auth.username;
            const _id = await UserController.getUserIdByUsername(username);
            await UserModel.updateOne(
                { username: username },
                {
                    $push: {
                        posts: {
                            author: _id,
                            _id: uniqid(),
                            text: req.body.text,
                            username,
                            timestamp: Date.now(),
                            likedBy: [],
                            fileURL
                        }
                    }
                });
            res.send({ status: 'ok' });

        } catch (e) {
            res.send({ status: 'error', e });
        }
    }

    public async like(req: Req, res: Res) {
        try {
            const { usernamePostedPostId, postID } = req.body;
            const usernameID = req.auth.user_id;

            const doc = await UserModel.find({ $and: [{ _id: { $eq: usernamePostedPostId } }, { 'posts._id': { $eq: postID } }, { 'posts.likedBy._id': { $eq: usernameID } }], }, { posts: 1 });
            if (doc && doc.lingth > 0) return res.send({ status: 'Error', error: 'Already liked' });

            await UserModel.updateOne({ $and: [{ _id: { $eq: usernamePostedPostId } }, { 'posts._id': { $eq: postID } }], }, { $push: { 'posts.$.likedBy': { _id: usernameID } } });

            await UserModel.updateOne({ _id: usernameID }, { $push: { favorites: postID } });

            res.send({ status: 'ok' });
        } catch (e) {
            res.send({ status: 'error', e })
        }
    }

    public async dislike(req: Req, res: Res) {
        try {
            const { usernamePostedPostID, postID } = req.body
            const usernameID = req.auth.user_id
            await UserModel.updateOne({
                _id: { $eq: usernamePostedPostID },
                'posts._id': { $eq: postID }
            }, { $pull: { 'posts.$.likedBy': { _id: usernameID } } });
            await UserModel.updateOne({ _id: usernameID }, { $pull: { favorites: postID } });
            return res.send({ status: 'ok' })
        } catch (e) {
            res.send({ status: 'error', e })
        }
    }

    public async delete(req: Req, res: Res) {
        try {
            const username = req.auth.username
            const { postID } = req.body
            await UserModel.updateOne({ username }, { $pull: { posts: { _id: postID } } });
            res.send({ status: 'ok', deletedPost: postID })
        } catch (e) {
            res.send({ status: 'error', e })
        }
    }

    public async favorites(req: Req, res: Res) {
        try {
            const user_id = req.auth.user_id
            const doc = await UserModel.findOne({ _id: user_id });
            const docs = await UserModel.aggregate([{ $unwind: '$posts' }, { $match: { 'posts._id': { $in: doc.favorites } } }]);
            res.send({ status: 'ok', data: docs })
        } catch (e) {
            res.send({ status: 'error', e })
        }
    }
}

const EntryControllerInstance: EntryController = new EntryController()

export default EntryControllerInstance
