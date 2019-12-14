import { Request, Response, NextFunction } from 'express'
const jwt = require('jsonwebtoken')
import Config from '../config'
const cookie = require('cookie')

export default function auth(req: Request, res: Response, next: NextFunction) {
    const { token } = cookie.parse(req.headers.cookie || '')
    jwt.verify(token, Config.JWT_KEY, (err: any, decoded: any) => {
        if (!decoded) return res.send({ status: 'error', error: 'Not authorized' })
        req.auth = {
            user_id: decoded.user_id,
            username: decoded.username
        }
        next()
    })
}
