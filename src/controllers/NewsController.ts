import UserModel from '../models/UserModel'
import {Res, Req} from '../interfaces/index'

class NewsController {

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
