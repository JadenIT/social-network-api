import { Request, Response, NextFunction } from 'express';

const jwt = require('jsonwebtoken');
import Config from '../config';

const cookie = require('cookie');

export default async function auth(req: Request, res: Response, next: NextFunction) {
    const { token } = cookie.parse(req.headers.cookie || '');
    if (!token) {
        return res.send({ status: 'error', error: 'Not authorized' });
    }
    const decoded = await jwt.verify(token, Config.JWT_KEY);
    if (!decoded) return res.send({ status: 'error', error: 'Not authorized' });
    console.log('******', decoded)
    req.auth = {
        user_id: decoded.user_id,
        username: decoded.username
    };
    next();
}



