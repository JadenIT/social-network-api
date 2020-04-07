import {RouterInterface, Req, Res} from '../interfaces/index'
import DialogController from '../controllers/DialogController'
import auth from '../middlewares/auth'
import {Router} from 'express'

class DialogRouter implements RouterInterface {
    router: Router

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post('/dialog', auth, DialogController.createDialog);
        this.router.get('/dialog', auth, DialogController.getDialog);
        this.router.get('/dialogs', auth, DialogController.getDialogsList);
    }
}

const DialogRouterInstance: DialogRouter = new DialogRouter()
export default DialogRouterInstance.router
