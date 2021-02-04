const bcrypt = require('bcrypt');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

import UserModel from '../models/UserModel'
import { Res, Req } from '../interfaces/index'
import Config from '../config'

class AuthController {
    public async login(req: Req, res: Res) {
        try {
            const { username, password } = req.body
            if (!_.trim(username) || !_.trim(password)) return res.send({
                status: "Error",
                error: 'Не все поля заполнены'
            })

            const user = await UserModel.findOne({ username });
            if (!user) return res.send({ status: "Error", error: 'Неправильное имя пользователя' });
            const hash = await bcrypt.compare(password, user.password);
            if (!hash) return res.send({ status: 'Error', error: 'Неверный пароль' });
            const token = jwt.sign({ user_id: user._id, username: username }, Config.JWT_KEY);

            res.setHeader(
                'Set-Cookie',
                cookie.serialize('token', token, {
                    maxAge: 60 * 60 * 24 * 7,
                    domain: 'www.vladislavkruglikov.com',
                    path: '/'
                })
            );

            console.log(req.cookies)

            res.send({ status: 'ok', token: token });
        } catch (e) {
            res.send({ status: 'error', e });
        }
    }

    public async Authorize(req: Req, res: Res) {
        try {
            const { token } = req.cookies;
            if (!token) return res.send({ isAuthorized: false, token: null });
            const decoded = jwt.verify(token, Config.JWT_KEY);
            res.send({
                isAuthorized: decoded,
                token: token,
            })
        } catch (e) {
            res.send({ status: 'error', e });
        }
    }
}

const AuthControllerInstance: AuthController = new AuthController()
export default AuthControllerInstance
