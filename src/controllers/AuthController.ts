const bcrypt = require('bcrypt')
const cookie = require('cookie')
import UserModel from '../models/UserModel'
import { Response } from 'express'

class AuthController {
    public login(username: String, password: String) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ username })
                .then((doc: any) => {
                    if (!doc) return reject('Incorrect username')
                    bcrypt
                        .compare(password, doc.password)
                        .then((hash: any) => {
                            if (!hash) return reject('Incorrect password')
                            resolve(doc._id)
                        })
                        .catch((error: any) => reject(error))
                })
                .catch((error: any) => reject(error))
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
