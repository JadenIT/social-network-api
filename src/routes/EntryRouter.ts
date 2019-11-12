import EntryController from '../controllers/EntryController'
import { Router } from 'express'
import RouterInterface from '../interfaces/Router'
import auth from '../middlewares/auth'

class EntryRouter implements RouterInterface {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }

    routes() {
        this.router.post('/', auth, EntryController.create)
        this.router.post('/like', auth, EntryController.like)
        this.router.post('/dislike', auth, EntryController.dislike)
    }
}

const EntryRouterInstance: EntryRouter = new EntryRouter()
export default EntryRouterInstance.router
