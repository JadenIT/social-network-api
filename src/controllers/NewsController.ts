import UserModel from '../models/UserModel'

class NewsController {
    private getNewsByArrOfSUbscriptions(arr: Array<String>) {
        return new Promise((resolve, reject) => {
            if (arr.length <= 0) return resolve([])
            UserModel.find({ _id: { $in: arr } }, { _id: 0, username: 1, avatar: 1, fullname: 1, posts: 1 })
                .then((response: any) => {

                    let newArr: any = []

                    response.map((el) => {
                        el.posts.map((el2) => {
                            delete el2.username
                            delete el2.avatar

                            newArr.push({
                                username: el.username,
                                fullname: el.fullname,
                                avatar: el.avatar,
                                post: el2
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

    public getNewsByUsername(username: String, page: any, perpage: any) {
        return new Promise((resolve, reject) => {
            let end = page * perpage
            let start = end - (perpage - 1) - 1

            let self = this

            UserModel.findOne({ username: username }, { subscriptions: 1 }, function(error: any, doc: any) {
                if (error) throw error
                const { subscriptions } = doc || []

                if (!subscriptions) resolve([])

                self.getNewsByArrOfSUbscriptions(subscriptions)
                    .then((news: any) => resolve(news.splice(start, perpage)))
                    .catch((error: any) => reject(error))
            })
        })
    }
}

const NewsControllerInstance: NewsController = new NewsController()
export default NewsControllerInstance
