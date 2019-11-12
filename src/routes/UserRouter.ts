const jwt = require('jsonwebtoken')
import { Router, Request, Response } from 'express'
import UserController from '../controllers/UserController'
import upload from '../middlewares/storage'
import RouterInterface from '../interfaces/Router'
import Config from '../config/index'
import auth from '../middlewares/auth'
import AuthController from '../controllers/AuthController'

class UserRouter implements RouterInterface {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }
    CreateUser(req: Request, res: Response): void {
        const { fullName, username, password } = req.body
        UserController.createUser({ fullName, username, password })
            .then((user_id) => {
                jwt.sign({ user_id, username }, Config.JWT_KEY, (err: any, token: any) => {
                    AuthController.setCookie(res, 'token', token, 60 * 60 * 24 * 7)
                    res.send({ status: 'ok' })
                })
            })
            .catch((err) => res.send({ status: 'error', error: err }))
    }

    UpdateUser(req: Request, res: Response) {
        upload(req, res, (err: Error) => {
            if (err) return res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' })
            const { oldUsername, newUsername, newPassword, newAbout, newFullname } = req.body
            const fileURL = req.files[0] ? req.files[0].location : null

            UserController.updateUser({ oldUsername, newUsername, newFullName: newFullname, newPassword, newAbout, fileURL })
                .then((onResolved: any) => {
                    jwt.sign({ username: newUsername ? newUsername : oldUsername }, Config.JWT_KEY, (err: any, token: any) => {
                        AuthController.setCookie(res, 'token', token, 60 * 60 * 24 * 7)
                        res.send({ status: 'ok' })
                    })
                })
                .catch((error: Error) => res.send({ status: 'error', error: 'error' }))
        })
    }

    GetUser(req: Request, res: Response): void {
        const { username } = req.params
        UserController.getUserByUsername(username)
            .then((response) => res.send({ user: response }))
            .catch((error) => res.send({ error }))
    }

    Subscribe(req: Request, res: Response): void {
        const { usernameToSubscribeID } = req.body
        const usernameID = req.auth.user_id
        UserController.subscribe(usernameID, usernameToSubscribeID)
            .then((response) => res.send({ status: 'ok' }))
            .catch((error) => res.send({ status: 'error' }))
    }

    UnSubscribe(req: Request, res: Response): void {
        const { usernameToSubscribeID } = req.body
        const usernameID = req.auth.user_id
        UserController.unSubscribe(usernameID, usernameToSubscribeID)
            .then((response) => res.send({ status: 'ok', response }))
            .catch((error) => res.send({ status: 'error' }))
    }

    GetSubscriptionsByUsername(req: Request, res: Response): void {
        const { username } = req.params
        UserController.getSubscriptionsByUsername(username)
            .then((subscriptions) => {
                res.send({
                    status: 'ok',
                    subscriptions
                })
            })
            .catch((error) => res.send({ status: 'error' }))
    }

    getSubscribersByUsername(req: Request, res: Response): void {
        const { username } = req.params
        UserController.getSubscribersByUsername(username)
            .then((subscribers) => {
                res.send({
                    status: 'ok',
                    subscribers
                })
            })
            .catch((error) => res.send({ status: 'error' }))
    }

    Logout(req: Request, res: Response) {
        AuthController.setCookie(res, 'token', null, 0)
        res.send({ status: 'ok' })
    }

    SuggestionsByUsername(req: Request, res: Response): void {
        const { username } = req.query

        UserController.suggestionsByUsername(username)
            .then((suggestions) => res.send({ suggestions }))
            .catch((err) => res.send({ status: 'error', error: err }))
    }

    routes() {
        this.router.post('/', this.CreateUser)
        this.router.get('/:username', auth, this.GetUser)
        this.router.post('/update', auth, this.UpdateUser)
        this.router.post('/subscribe', auth, this.Subscribe)
        this.router.post('/unsubscribe', auth, this.UnSubscribe)
        this.router.get('/subscriptions/:username', auth, this.GetSubscriptionsByUsername)
        this.router.get('/subscribers/:username', auth, this.getSubscribersByUsername)
        this.router.post('/logout', this.Logout)
        this.router.get('/suggestions/suggestionsByUsername', auth, this.SuggestionsByUsername)
    }
}
const UserRouterInstance: UserRouter = new UserRouter()
export default UserRouterInstance.router
