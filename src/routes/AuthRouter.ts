import AuthController from '../controllers/AuthController'
import { Router } from 'express'
import RouterInterface from '../interfaces/Router'

class AuthRouter implements RouterInterface {
    router: Router

    constructor() {
        this.router = Router()
        this.routes()
    }

    routes() {
        this.router.post('/login', AuthController.login)
        this.router.get('/authorize', AuthController.Authorize)
    }
}

const AuthRouterInstance: AuthRouter = new AuthRouter()

export default AuthRouterInstance.router
