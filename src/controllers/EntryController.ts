import UserController from './UserController'
const uniqid = require('uniqid')
import UserModel from '../models/UserModel'

interface CreateInterface {
    username: String
    text: String
    timestamp: Number
    buffer: any
}

class EntryController {
    public create(entry: CreateInterface) {
        return new Promise(async (resolve, reject) => {
            let usernameID
            await UserController.getUserIdByUsername(entry.username)
                .then((_id) => (usernameID = _id))
                .catch((err) => reject(err))

            UserModel.updateOne(
                { username: entry.username },
                {
                    $push: {
                        posts: {
                            _id: usernameID,
                            id: uniqid(),
                            text: entry.text,
                            username: entry.username,
                            timestamp: entry.timestamp,
                            likedBy: [],
                            buffer: entry.buffer
                        }
                    }
                }
            )
                .then((doc: any) => resolve())
                .catch((error: any) => reject(error))
        })
    }

    public like(usernameID: String, usernamePostedPostID: String, postID: any) {
        return new Promise((resolve, reject) => {
            UserModel.find(
                {
                    $and: [{ _id: { $eq: { usernamePostedPostID } } }, { 'posts.id': { $eq: postID } }, { 'posts.likedBy._id': { $eq: usernameID } }]
                },
                { posts: 1 },
                (error: any, doc: any) => {
                    if (doc) return reject('Already liked')

                    UserModel.updateOne(
                        {
                            $and: [
                                { _id: { $eq: usernamePostedPostID } },
                                {
                                    'posts.id': {
                                        $eq: postID
                                    }
                                }
                            ]
                        },
                        {
                            $push: {
                                'posts.$.likedBy': {
                                    _id: usernameID
                                }
                            }
                        },
                        (error: any, doc: any) => {
                            if (error) throw error
                            resolve('Successfuly liked')
                        }
                    )
                }
            )
        })
    }

    public dislike(usernameID: String, usernamePostedPostID: String, postID: any) {
        return new Promise((resolve, reject) => {
            UserModel.updateOne(
                {
                    _id: { $eq: usernamePostedPostID },
                    'posts.id': {
                        $eq: postID
                    }
                },
                {
                    $pull: {
                        'posts.$.likedBy': {
                            _id: usernameID
                        }
                    }
                },
                (error: any, doc: any) => {
                    if (error) return reject(error)
                    resolve()
                }
            )
        })
    }
}

const EntryControllerInstance: EntryController = new EntryController()

export default EntryControllerInstance
