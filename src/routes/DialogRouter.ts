const jwt = require('jsonwebtoken')
import { Router, Request, Response } from 'express'
import DialogController from '../controllers/DialogController'
import RouterInterface from '../interfaces/Router'
import auth from '../middlewares/auth'
import Config from '../config/index'

class DialogRouter implements RouterInterface {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }
    CreateDialog(req: Request, res: Response) {
        const { users } = req.body

        if(users.some((el: any) => el == req.auth.user_id))){

            DialogController.createDialog(users)
            .then((dialogID) =>  res.send({ dialogID }))
            .catch((error) => res.send({ error }))
        }
    }

    CreateMessage(req: Request, res: Response): void {
        const { message, dialogID, token } = req.body
        jwt.verify(token, Config.JWT_KEY, (err: any, decoded: any) => {
            if (!decoded) return res.send({ status: 'error', error: 'Not authorized' })
            DialogController.createMessage(decoded.username, message, dialogID)
                .then((resp) => res.end({ status: 'ok' }))
                .catch((error) => res.send({ error }))
        })
    }

    async GetMessages(req: Request, res: Response) {
        const username = req.auth.username
        const query = req.query.query
        DialogController.getMessages(username, query)
            .then((dialogs) => res.send({ dialogs }))
            .catch((error) => res.send({ error }))
    }

    getDialog(req: Request, res: Response): void {
        const { dialogID } = req.query
        DialogController.getDialog(dialogID)
            .then((dialog) => res.send({ dialog }))
            .catch((error) => res.send({ error }))
    }

    routes() {
        this.router.post('/dialog', auth, this.CreateDialog)
        this.router.get('/dialog', auth, this.getDialog)
        this.router.post('/message', this.CreateMessage)
        this.router.get('/dialogs', auth, this.GetMessages)
    }
}
const DialogRouterInstance: DialogRouter = new DialogRouter()
export default DialogRouterInstance.router
