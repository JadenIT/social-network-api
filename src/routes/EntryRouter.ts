import EntryController from '../controllers/EntryController'
import { Router, Request, Response } from 'express'
import upload from '../middlewares/storage'
import RouterInterface from '../interfaces/Router'
import auth from '../middlewares/auth'

class EntryRouter implements RouterInterface {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }

    createEntry(req: Request, res: Response) {
        upload(req, res, (err: any) => {
            if (err) return res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' })
            const username = req.auth.username
            const fileURL = req.files[0] ? req.files[0].location : null
            EntryController.create({ username, text: req.body.text, timestamp: Date.now(), fileURL })
                .then((onResolved: any) => res.send({ status: 'ok' }))
                .catch((error: any) => res.send({ status: 'error', error: error }))
        })
    }

    Like(req: Request, res: Response) {
        const { usernamePostedPostID, postID } = req.body
        const usernameID = req.auth.user_id
        EntryController.like(usernameID, usernamePostedPostID, postID)
            .then((Response: any) => res.send({ status: Response }))
            .catch((error: any) => res.send({ status: 'error', error: error }))
    }

    Dislike(req: Request, res: Response) {
        const { usernamePostedPostID, postID } = req.body
        const usernameID = req.auth.user_id
        EntryController.dislike(usernameID, usernamePostedPostID, postID)
            .then((response) => res.send(response))
            .catch((error) => res.send({ status: 'error', error: error }))
    }

    routes() {
        this.router.post('/', auth, this.createEntry)
        this.router.post('/like', auth, this.Like)
        this.router.post('/dislike', auth, this.Dislike)
    }
}

const EntryRouterInstance: EntryRouter = new EntryRouter()
export default EntryRouterInstance.router
