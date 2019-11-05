import AuthController from '../controllers/AuthController'
import { Router, Request, Response } from 'express'
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

class AuthRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }
    public Login(req: Request, res: Response) {
        const { username, password } = req.body

        AuthController.isUserIsset(username, password)
            .then((onResolved) => {
                jwt.sign({ username: username }, process.env.JWT_KEY, (err: any, token: any) => {
                    res.setHeader(
                        'Set-Cookie',
                        cookie.serialize('token', token, {
                            maxAge: 60 * 60 * 24 * 7,
                            path: '/'
                        })
                    )
                    res.send({ status: 'ok' })
                })
            })
            .catch((error) => res.send({ status: 'error', error: error }))
    }

    public Authorize(req: Request, res: Response) {
        const { token } = req.cookies
        if (!token) return res.send({ isAuthorized: false, token: null })
        jwt.verify(token, process.env.JWT_KEY, (err: any, decoded: any) => {
            if (err) throw err
            res.send({
                isAuthorized: decoded,
                token: token
            })
        })
    }

    routes() {
        this.router.post('/login', this.Login)
        this.router.get('/authorize', this.Authorize)
    }
}

const AuthRouterInstance: AuthRouter = new AuthRouter()

export default AuthRouterInstance.router
