import { Router } from 'express'
import SearchController from '../controllers/SearchController'
import { RouterInterface } from '../interfaces/index'
import auth from '../middlewares/auth'

class SearchRouter implements RouterInterface {
    router: Router

    constructor() {
        this.router = Router()
        this.routes()
    }

    routes() {
        this.router.get('/', auth, SearchController.searchByQueryForUsernameOrFullName)
    }
}
const SearchRouterInstance: SearchRouter = new SearchRouter()

export default SearchRouterInstance.router
