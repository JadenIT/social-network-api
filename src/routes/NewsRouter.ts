import NewsController from '../controllers/NewsController'
import { Router } from 'express'
import RouterInterface from '../interfaces/Router'
import auth from '../middlewares/auth'

class NewsRouter implements RouterInterface {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }
    routes() {
        this.router.get('/', auth, NewsController.getNewsByUsername)
    }
}

const NewsRouterInstance: NewsRouter = new NewsRouter()

export default NewsRouterInstance.router
