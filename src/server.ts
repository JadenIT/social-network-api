import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as http from 'http'

import UserRouter from './routes/UserRouter'
import EntryRouter from './routes/EntryRouter'
import SearchRouter from './routes/SearchRouter'
import AuthRouter from './routes/AuthRouter'
import DialogRouter from './routes/DialogRouter'
import NewsRouter from './routes/NewsRouter'

import cookies from './middlewares/cookies'
import cors from './middlewares/cors'
import Socket from "./socket";

class Server {
    public app: express.Application;
    public server: any;

    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
        this.httpServer();
        this.socket();
    }

    private httpServer = () => this.server = http.createServer(this.app);

    private socket = () => new Socket(this.server);

    private middlewares(): void {
        this.app.use(cookies);
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(cors);
        this.app.use(express.static(__dirname));
    }

    private routes(): void {
        this.app.use('/user', UserRouter);
        this.app.use('/entry', EntryRouter);
        this.app.use('/search', SearchRouter);
        this.app.use('/auth', AuthRouter);
        this.app.use('/messenger', DialogRouter);
        this.app.use('/news', NewsRouter);
    }
}

const ServerInstance: Server = new Server();

export default ServerInstance.server;
