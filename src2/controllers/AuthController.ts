const bcrypt = require('bcrypt')
import UserModel from '../models/UserModel'

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
}

const AuthControllerInstance: AuthController = new AuthController()
export default AuthControllerInstance
