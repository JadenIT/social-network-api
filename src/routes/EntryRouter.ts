import EntryController from '../controllers/EntryController'
import { Router } from 'express'
import { RouterInterface } from '../interfaces/index'
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
        this.router.post('/delete', auth, EntryController.delete)
        this.router.get('/favorites', auth, EntryController.favorites)
    }
}

const EntryRouterInstance: EntryRouter = new EntryRouter()
export default EntryRouterInstance.router
