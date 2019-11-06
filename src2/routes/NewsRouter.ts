import NewsController from '../controllers/NewsController'
import { Request, Response, Router } from 'express'
import RouterInterface from '../interfaces/Router'
import auth from '../middlewares/auth'

class NewsRouter implements RouterInterface {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }
    getNewsByUsername(req: Request, res: Response) {
        const { page, perpage } = req.query
        const username = req.auth.username
        console.log(username)
        NewsController.getNewsByUsername(username, page, perpage)
            .then((news) => res.send({ news }))
            .catch((error) => res.send({ status: 'error', error: error }))
    }
    routes() {
        this.router.get('/', auth, this.getNewsByUsername)
    }
}

const NewsRouterInstance: NewsRouter = new NewsRouter()
export default NewsRouterInstance.router
