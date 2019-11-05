import NewsController from '../controllers/NewsController'
import { Request, Response, Router } from 'express'

class NewsRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }
    getNewsByUsername(req: Request, res: Response) {
        const { username, page, perpage, token } = req.query
        NewsController.getNewsByUsername(username, page, perpage, token)
            .then((news) => res.send({ news }))
            .catch((error) => res.send({ status: 'error', error: error }))
    }
    routes() {
        this.router.get('/', this.getNewsByUsername)
    }
}

const NewsRouterInstance: NewsRouter = new NewsRouter()
export default NewsRouterInstance.router
