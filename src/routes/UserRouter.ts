import { Router } from 'express'
import UserController from '../controllers/UserController'
import { RouterInterface } from '../interfaces/index'
import auth from '../middlewares/auth'

class UserRouter implements RouterInterface {
    router: Router

    constructor() {
        this.router = Router()
        this.routes()
    }
    
    routes() {
        this.router.post('/', UserController.createUser)
        this.router.get('/:username', auth, UserController.getUserByUsername)
        this.router.post('/update', auth, UserController.updateUser)
        this.router.post('/subscribe', auth, UserController.subscribeToUser)
        this.router.post('/unsubscribe', auth, UserController.unSubscribeFromUser)
        this.router.get('/subscriptions/:username', auth, UserController.getSubscriptionsByUsername)
        this.router.get('/subscribers/:username', auth, UserController.getSubscribersByUsername)
        this.router.post('/logout', UserController.logout)
        this.router.get('/suggestions/suggestionsByUsername', auth, UserController.suggestionsByUsername)
    }
}
const UserRouterInstance: UserRouter = new UserRouter()
export default UserRouterInstance.router
