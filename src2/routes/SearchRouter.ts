import { Router, Request, Response } from 'express'
import SearchController from '../controllers/SearchController'
import RouterInterface from '../interfaces/Router'
import auth from '../middlewares/auth'

class SearchRouter implements RouterInterface {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }
    searchByQueryForUsernameOrFullName(req: Request, res: Response): void {
        const { query } = req.query
        SearchController.searchByQueryForUsernameOrFullName(query)
            .then((docs) => res.send({ search: docs }))
            .catch((error) => res.send({ status: 'error' }))
    }

    routes() {
        this.router.get('/', auth, this.searchByQueryForUsernameOrFullName)
    }
}
const SearchRouterInstance: SearchRouter = new SearchRouter()
export default SearchRouterInstance.router
