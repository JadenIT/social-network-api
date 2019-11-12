import { Router, Request, Response } from 'express'
import DialogController from '../controllers/DialogController'
import RouterInterface from '../interfaces/Router'
import auth from '../middlewares/auth'

class DialogRouter implements RouterInterface {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }
    CreateDialog(req: Request, res: Response) {
        const { users } = req.body

        DialogController.createDialog(users)
            .then((dialogID) => res.send({ dialogID }))
            .catch((e) => res.end({ error: e }))
    }

    CreateMessage(req: Request, res: Response): void {
        const { message, dialogID } = req.body
        const { username } = req.auth
        DialogController.createMessage(username, message, dialogID)
            .then((resp) => res.end({ status: 'ok' }))
            .catch((error) => res.send({ error }))
    }

    GetMessages(req: Request, res: Response) {
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
        this.router.post('/message', auth, this.CreateMessage)
        this.router.get('/dialogs', auth, this.GetMessages)
    }
}
const DialogRouterInstance: DialogRouter = new DialogRouter()
export default DialogRouterInstance.router
