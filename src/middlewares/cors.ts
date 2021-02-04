import { Request, Response, NextFunction } from 'express'
import Config from '../config'

export default function cors(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
}
