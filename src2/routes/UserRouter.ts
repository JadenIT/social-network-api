import { Router, Request, Response } from 'express'
import UserController from '../controllers/UserController'
import upload from '../middlewares/storage'
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const fs = require('fs')

class UserRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }
    CreateUser(req: Request, res: Response): void {
        const { fullName, username, password } = req.body
        UserController.createUser({ fullName, username, password })
            .then((response) => {
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
            .catch((err) => res.send({ status: 'error', error: err }))
    }

    UpdateUser(req: Request, res: Response) {
        upload(req, res, (err: Error) => {
            if (err) {
                res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' })
            } else {
                const { oldUsername, newUsername, newPassword, newAbout, newFullname } = req.body
                const newAvatar = req.files ? req.files[0] : null
                let avatarBuffer
                if (newAvatar) {
                    avatarBuffer = fs.readFileSync(`./uploads/${newAvatar.filename}`)
                }
                let newFullName = newFullname

                UserController.updateUser({ oldUsername, newUsername, newFullName, newPassword, newAbout, avatarBuffer })
                    .then((onResolved: any) => {
                        jwt.sign({ username: newUsername ? newUsername : oldUsername }, process.env.JWT_KEY, (err: any, token: any) => {
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
                    .catch((error: Error) => {
                        res.send({ status: 'error', error: 'error' })
                    })
            }
        })
    }

    GetUser(req: Request, res: Response): void {
        const { username } = req.params
        UserController.getUserByUsername(username)
            .then((response) => res.send({ user: response }))
            .catch((error) => res.send({ error }))
    }

    Subscribe(req: Request, res: Response): void {
        const { usernameID, usernameToSubscribeID } = req.body
        UserController.subscribe(usernameID, usernameToSubscribeID)
            .then((response) => res.send({ status: 'ok' }))
            .catch((error) => res.send({ status: 'error' }))
    }

    UnSubscribe(req: Request, res: Response): void {
        const { usernameID, usernameToSubscribeID } = req.body
        UserController.unSubscribe(usernameID, usernameToSubscribeID)
            .then((response) => res.send({ status: 'ok', response }))
            .catch((error) => res.send({ status: 'error' }))
    }

    GetSubscriptionsByUsername(req: Request, res: Response): void {
        const { username } = req.query
        UserController.getSubscriptionsByUsername(username)
            .then((subscriptions) => {
                res.send({
                    status: 'ok',
                    subscriptions
                })
            })
            .catch((error) => res.send({ status: 'error' }))
    }

    Logout(req: Request, res: Response) {
        res.setHeader(
            'Set-Cookie',
            cookie.serialize('token', 'null', {
                expires: new Date(),
                path: '/'
            })
        )
        res.send({ status: 'ok' })
    }

    routes() {
        this.router.post('/', this.CreateUser)
        this.router.get('/:username', this.GetUser)
        this.router.post('/update', this.UpdateUser)
        this.router.post('/subscribe', this.Subscribe)
        this.router.post('/unsubscribe', this.UnSubscribe)
        this.router.get('subscriptions', this.GetSubscriptionsByUsername)
        this.router.post('/logout', this.Logout)
    }
}
const UserRouterInstance: UserRouter = new UserRouter()
export default UserRouterInstance.router
