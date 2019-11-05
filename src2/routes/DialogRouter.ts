import { Router, Request, Response } from 'express'
import DialogController from '../controllers/DialogController'

class DialogRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }
    CreateDialog(req: Request, res: Response): void {
        const { users, token } = req.body
        DialogController.createDialog(users, token)
            .then((dialogID) => res.send({ dialogID }))
            .catch((error) => res.send({ error }))
    }

    CreateMessage(req: Request, res: Response): void {
        const { username, message, dialogID, token } = req.body
        DialogController.createMessage(username, message, dialogID, token)
            .then((resp) => res.end({ status: 'ok' }))
            .catch((error) => res.send({ error }))
    }

    GetMessages(req: Request, res: Response): void {
        const { username, token } = req.query
        DialogController.getMessages(username, token)
            .then((dialogs) => {
                res.send({ dialogs })
            })
            .catch((error) => res.send({ error }))
    }

    getDialog(req: Request, res: Response): void {
        const { dialogID, token } = req.query
        DialogController.getDialog(dialogID, token)
            .then((dialog) => res.send({ dialog }))
            .catch((error) => res.send({ error }))
    }

    routes() {
        this.router.post('/dialog', this.CreateDialog)
        this.router.post('/message', this.CreateMessage)
        this.router.get('/dialogs', this.GetMessages)
        this.router.get('/dialog', this.getDialog)
    }
}
const DialogRouterInstance: DialogRouter = new DialogRouter()
export default DialogRouterInstance.router
