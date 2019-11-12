import UserModel from '../models/UserModel'
import { Request, Response } from 'express'

class NewsController {
    static getNewsByArrOfSubscriptions(arr: Array<String>) {
        return new Promise((resolve, reject) => {
            if (arr.length <= 0) return resolve([])
            UserModel.find(
                { _id: { $in: arr } },
                {
                    _id: 0,
                    username: 1,
                    avatar: 1,
                    fullname: 1,
                    posts: 1,
                }
            )
                .then((response: any) => {
                    let newArr: any = []

                    response.map(el => {
                        el.posts.map(el2 => {
                            delete el2.username
                            delete el2.avatar

                            newArr.push({
                                username: el.username,
                                fullname: el.fullname,
                                avatar: el.avatar,
                                post: el2,
                            })
                        })
                    })

                    newArr.sort((a, b) => {
                        if (a.post.timestamp > b.post.timestamp) {
                            return -1
                        } else {
                            return 1
                        }
                    })

                    resolve(newArr)
                })
                .catch((error: any) => {
                    reject(error)
                })
        })
    }

    public getNewsByUsername(req: Request, res: Response) {
        try {
            const { page, perpage } = req.query
            const username = req.auth.username
            let end = page * perpage
            let start = end - (perpage - 1) - 1

            UserModel.findOne({ username: username }, { subscriptions: 1 }, function(error: any, doc: any) {
                if (error) throw error
                const { subscriptions } = doc || []

                if (!subscriptions) return res.send([])

                NewsController.getNewsByArrOfSubscriptions(subscriptions)
                    .then((news: any) => res.send({news: news.splice(start, perpage}))
                    .catch((error: any) => res.send({ status: 'error', error }))
            })
        } catch (error) {
            res.send({ status: 'error', error })
        }
    }
}

const NewsControllerInstance: NewsController = new NewsController()

export default NewsControllerInstance
