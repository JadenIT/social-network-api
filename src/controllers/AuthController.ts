const bcrypt = require('bcrypt')
const cookie = require('cookie')
import UserModel from '../models/UserModel'
import { Response } from 'express'

class AuthController {
    public login(username: String, password: String) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function(err: any, doc: any) {
                if (!doc) return reject('Incorrect username')
                if (err) reject(err)
                bcrypt.compare(password, doc.password, function(err: any, hash: any) {
                    if (!hash) return reject('Incorrect password')
                    resolve(doc._id)
                })
            })
        })
    }

    public setCookie(res: Response, field: any, value: any, maxAge: any) {
        res.setHeader(
            'Set-Cookie',
            cookie.serialize(field, value, {
                maxAge: maxAge,
                path: '/'
            })
        )
    }
}

const AuthControllerInstance: AuthController = new AuthController()
export default AuthControllerInstance
