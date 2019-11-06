import { Request, Response, NextFunction } from 'express'

export default function cors(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT)
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
}
