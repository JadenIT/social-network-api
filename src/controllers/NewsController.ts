import UserModel from '../models/UserModel'
import { Res, Req } from '../interfaces/index'

class NewsController {
    static getNewsByArrOfSubscriptions(arr: Array<String>) {
        return new Promise((resolve, reject) => {
            if (arr.length <= 0) return resolve([])
            UserModel.find(
                { _id: { $in: arr } },
                {
                    _id: 1,
                    username: 1,
                    avatar: 1,
                    fullname: 1,
                    posts: 1,
                }
            )
                .then((response: any) => {
                    let newArr: any = []

                    response.map((el: any) => {
                        el.posts.map((el2: any) => {
                            delete el2.username
                            delete el2.avatar

                            newArr.push({
                                _id: el._id,
                                username: el.username,
                                fullname: el.fullname,
                                avatar: el.avatar,
                                post: el2,
                            })
                        })
                    })

                    newArr.sort((a: any, b: any) => {
                        if (a.post.timestamp > b.post.timestamp) {
                            return -1
                        } else {
                            return 1
                        }
                    })

                    resolve(newArr)
                })
                .catch((error: any) => reject(error))
        })
    }

    public getNewsByUsername(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const { page, perpage } = req.query
            const username = req.auth.username
            let end = page * perpage
            let start = end - (perpage - 1) - 1
            UserModel.findOne({ username: username }, { subscriptions: 1 }, function (err: any, doc: any) {
                if (err) reject(err)
                const { subscriptions } = doc || []
                if (!subscriptions) return resolve([])
                NewsController.getNewsByArrOfSubscriptions(subscriptions)
                    .then((news: any) => resolve(news.splice(start, perpage)))
                    .catch((err: any) => reject(err))
            })
        }).then(news => res.send({ news: news })).catch(error => res.send({ status: 'error', error }))
    }
}

const NewsControllerInstance: NewsController = new NewsController()

export default NewsControllerInstance
