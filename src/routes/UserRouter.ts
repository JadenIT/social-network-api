import { Router, Request, Response } from 'express'
import UserController from '../controllers/UserController'
import RouterInterface from '../interfaces/Router'
import auth from '../middlewares/auth'
const cookie = require('cookie')

class UserRouter implements RouterInterface {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }

    logout(req: Request, res: Response) {
        res.setHeader(
            'Set-Cookie',
            cookie.serialize('token', null, {
                maxAge: 0,
                path: '/',
            })
        )
        res.send({ status: 'ok' })
    }

    routes() {
        this.router.post('/', UserController.createUser)
        this.router.get('/:username', auth, UserController.getUserByUsername)
        this.router.post('/update', auth, UserController.updateUser)
        this.router.post('/subscribe', auth, UserController.subscribeToUser)
        this.router.post('/unsubscribe', auth, UserController.unSubscribeFromUser)
        this.router.get('/subscriptions/:username', auth, UserController.getSubscriptionsByUsername)
        this.router.get('/subscribers/:username', auth, UserController.getSubscribersByUsername)
        this.router.post('/logout', this.logout)
        this.router.get('/suggestions/suggestionsByUsername', auth, UserController.suggestionsByUsername)
    }
}
const UserRouterInstance: UserRouter = new UserRouter()
export default UserRouterInstance.router
