const router = require('express').Router()
const userController = require('../controllers/userController')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

router.post('/user', (req, res, next) => {
    const { fullname, username, password } = req.body
    if (fullname && username && password) {
        userController.usernameIsFree(username, (response) => {
            if (!response) {
                res.send({
                    error: 'Username has been already taken'
                })
            }
            else {
                userController.save(fullname, username, password, null, (err) => {
                    if (err) throw err
                    jwt.sign({ username: username }, 'Some key', (err, token) => {
                        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                            maxAge: 60 * 60 * 24 * 7 // 1 week
                        }))
                        res.send({
                            error: ''
                        })
                    })
                })
            }
        })
    }
    else {
        res.send({
            error: 'Fullname or username or password is empty'
        })
    }
})

module.exports = router