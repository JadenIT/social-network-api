const cookie = require('cookie')
import { Request, Response, NextFunction } from 'express'

export default function(req: Request, res: Response, next: NextFunction) {
    req.cookies = cookie.parse(req.headers.cookie || '')
    next()
}
