import * as express from 'express'
import * as bodyParser from 'body-parser'

/* Import routes */
import UserRouter from './routes/UserRouter'
import EntryRouter from './routes/EntryRouter'
import SearchRouter from './routes/SearchRouter'
import AuthRouter from './routes/AuthRouter'
import DialogRouter from './routes/DialogRouter'
import NewsRouter from './routes/NewsRouter'

/* Import middlewares */
import cookies from './middlewares/cookies'
import cors from './middlewares/cors'

class Server {
    public app: express.Application
    constructor() {
        this.app = express()
        this.middlewares()
        this.routes()
    }

    public middlewares(): void {
        this.app.use(cookies)
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(bodyParser.json())
        this.app.use(cors)
        this.app.use(express.static(__dirname))
    }

    public routes(): void {
        this.app.use('/user', UserRouter)
        this.app.use('/entry', EntryRouter)
        this.app.use('/search', SearchRouter)

        this.app.use('/auth', AuthRouter)
        this.app.use('/messenger', DialogRouter)
        this.app.use('/news', NewsRouter)
    }
}

const ServerInstance = new Server()

export default ServerInstance
