const bcrypt = require('bcrypt')
const cookie = require('cookie')
import UserModel from '../models/UserModel'
import { Res, Req } from '../interfaces/index'
const jwt = require('jsonwebtoken')
const _ = require('lodash')
import Config from '../config'

class AuthController {
    public login(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const { username, password } = req.body
            if (!_.trim(username) || !_.trim(password)) return reject('Не все поля заполнены')
            UserModel.findOne({ username }, function (err: any, doc: any) {
                if (!doc) return reject('Неправильное имя пользователя')
                if (err) return reject(err)
                bcrypt.compare(password, doc.password, function (err: any, hash: any) {
                    if (!hash) return reject('Неверный пароль')
                    jwt.sign({ user_id: doc._id, username: username }, Config.JWT_KEY, (err: any, token: any) => {
                        res.setHeader(
                            'Set-Cookie',
                            cookie.serialize('token', token, {
                                maxAge: 60 * 60 * 24 * 7,
                                path: '/',
                            })
                        )
                        resolve()
                    })
                })
            })
        }).then(response => res.send({ status: 'ok' })).catch(error => res.send({ status: 'error', error }))
    }

    public Authorize(req: Req, res: Res) {
        return new Promise((resolve, reject) => {
            const { token } = req.cookies
            if (!token) return res.send({ isAuthorized: false, token: null })
            jwt.verify(token, Config.JWT_KEY, (err: any, decoded: any) => {
                if (err) reject(err)
                resolve({
                    isAuthorized: decoded,
                    token: token,
                })
            })
        }).then(response => res.send(response)).catch(error => res.send({ status: 'error', error }))
    }
}

const AuthControllerInstance: AuthController = new AuthController()
export default AuthControllerInstance
