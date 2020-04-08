import UserModel from '../models/UserModel'
import {Res, Req} from '../interfaces/index'

class NewsController {
    static async getNewsByArrOfSubscriptions(arr: Array<String>) {
        try {
            if (arr.length <= 0) return []
            const response = await UserModel.find({_id: {$in: arr}})
            let newArr: Array<any> = []

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

            return newArr

        } catch (e) {

        }
    }

    public async getNewsByUsername(req: Req, res: Res) {
        try {
            const {page, perpage} = req.query
            const username = req.auth.username
            let end = page * perpage
            let start = end - (perpage - 1) - 1
            const doc = await UserModel.findOne({username: username}, {subscriptions: 1});
            const {subscriptions} = doc || []
            if (!subscriptions) return res.send({news: []})

            const news = await UserModel.aggregate([
                {$match: {_id: {$in: subscriptions}}},
                {$unwind: '$posts'},
                {$sort: {'posts.timestamp': 1}}
            ])

            res.send({news: news.splice(start, perpage)});
        } catch (e) {
            res.send({status: 'Error'})
        }
    }
}

const NewsControllerInstance: NewsController = new NewsController()

export default NewsControllerInstance
