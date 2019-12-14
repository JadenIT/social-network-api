const bcrypt = require('bcrypt')
const cookie = require('cookie')
import UserModel from '../models/UserModel'
import { Request, Response } from 'express'
const jwt = require('jsonwebtoken')
const _ = require('lodash')
import Config from '../config'

class AuthController {
    public login(req: Request, res: Response) {
        try {
            const { username, password } = req.body
            // if (!_.trim(username) || !_.trim(password)) return res.send({ status: 'error', error: 'Пароль или имя пользователя не заполнено' })


            UserModel.findOne({ username }, function (err: any, doc: any) {
                if (!doc) return res.send({ status: 'error', error: 'Incorrect username' })
                if (err) return res.send({ status: 'error', error: err })
                bcrypt.compare(password, doc.password, function (err: any, hash: any) {
                    if (!hash) return res.send({ status: 'error', error: 'Incorrect password' })

                    jwt.sign({ user_id: doc._id, username: username }, Config.JWT_KEY, (err: any, token: any) => {
                        res.setHeader(
                            'Set-Cookie',
                            cookie.serialize('token', token, {
                                maxAge: 60 * 60 * 24 * 7,
                                path: '/',
                            })
                        )
                        res.send({ status: 'ok' })
                    })
                })
            })
        } catch (e) {
            res.send({ status: 'error', error: e })
        }
    }

    public Authorize(req: Request, res: Response) {
        try {
            const { token } = req.cookies
            if (!token) return res.send({ isAuthorized: false, token: null })
            jwt.verify(token, Config.JWT_KEY, (err: any, decoded: any) => {
                if (err) throw err
                res.send({
                    isAuthorized: decoded,
                    token: token,
                })
            })
        } catch (e) {
            res.send({ status: 'error', error: e })
        }
    }
}

const AuthControllerInstance: AuthController = new AuthController()
export default AuthControllerInstance
