import * as express from 'express'
import * as bodyParser from 'body-parser'

/* Import routes */
import UserRouter from './routes/UserRouter'
import EntryRouter from './routes/EntryRouter'
import SearchRouter from './routes/SearchRouter'

/* Import middlewares */
import cookies from './middlewares/cookies'
import cors from './middlewares/cors'

class Server {
    public app: express.Application
    constructor() {
        this.app = express()
        this.config()
        this.routes()
    }

    public config(): void {
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(bodyParser.json())
        this.app.use(cors)
        this.app.use(express.static(__dirname))
        this.app.use(cookies)
    }

    public routes(): void {
        this.app.use('/user', UserRouter)
        this.app.use('/entry', EntryRouter)
        this.app.use('/search', SearchRouter)
    }
}

const ServerInstance = new Server()

export default ServerInstance
