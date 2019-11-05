import EntryController from '../controllers/EntryController'
import { Router, Request, Response } from 'express'
import upload from '../middlewares/storage'
const fs = require('fs')

class EntryRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }

    createEntry(req: Request, res: Response) {
        upload(req, res, (err: any) => {
            if (err) return res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' })
            const { text, username, token } = req.body
            const file = req.files[0] || null
            const timestamp = Date.now()

            let buffer

            if (file) buffer = fs.readFileSync(`./uploads/${file.filename}`)

            EntryController.create({ username, text, timestamp, token, buffer })
                .then((onResolved: any) => {
                    res.send({ status: 'ok' })
                })
                .catch((error: any) => {
                    res.send({ status: 'error' })
                })
        })
    }

    Like(req: Request, res: Response) {
        const { usernameID, usernamePostedPostID, postID, token } = req.body
        EntryController.like(usernameID, usernamePostedPostID, postID, token)
            .then((Response: any) => res.send({ status: Response }))
            .catch((error: any) => res.send({ error }))
    }

    Dislike(req: Request, res: Response) {
        const { usernameID, usernamePostedPostID, postID, token } = req.body
        EntryController.dislike(usernameID, usernamePostedPostID, postID, token)
            .then((response) => res.send(response))
            .catch((error) => res.send({ error: error }))
    }

    routes() {
        this.router.post('/', this.createEntry)
        this.router.post('/like', this.Like)
        this.router.post('/dislike', this.Dislike)
    }
}

const EntryRouterInstance: EntryRouter = new EntryRouter()
export default EntryRouterInstance.router
