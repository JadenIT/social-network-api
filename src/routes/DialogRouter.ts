import { RouterInterface, Req, Res } from '../interfaces/index'
import DialogController from '../controllers/DialogController'
import auth from '../middlewares/auth'
import { Router } from 'express'

class DialogRouter implements RouterInterface {
    router: Router
    constructor() {
        this.router = Router()
        this.routes()
    }
    createDialog(req: Req, res: Res) {
        const { users } = req.body
        DialogController.createDialog(users)
            .then(dialogID => res.send({ dialogID }))
            .catch(e => res.end({ error: e }))
    }

    createMessage(req: Req, res: Res): void {
        const { message, dialogID } = req.body
        const { username } = req.auth
        DialogController.createMessage(username, message, dialogID)
            .then(resp => res.end({ status: 'ok' }))
            .catch(error => res.send({ error }))
    }

    getDialogsList(req: Req, res: Res) {
        const username = req.auth.username
        const query = req.query.query
        DialogController.getDialogsList(username, query)
            .then(dialogs => res.send({ dialogs }))
            .catch(error => res.send({ error }))
    }

    getDialog(req: Req, res: Res): void {
        const { dialogID } = req.query
        const { username } = req.auth
        DialogController.getDialog(dialogID, username)
            .then(dialog => res.send({ dialog }))
            .catch(error => res.send({ error }))
    }

    routes() {
        this.router.post('/dialog', auth, this.createDialog)
        this.router.get('/dialog', auth, this.getDialog)
        this.router.post('/message', auth, this.createMessage)
        this.router.get('/dialogs', auth, this.getDialogsList)
    }
}
const DialogRouterInstance: DialogRouter = new DialogRouter()
export default DialogRouterInstance.router
