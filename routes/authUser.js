const router = require('express').Router()
const userController = require('../controllers/userController')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    if (username && password) {
        userController.login(username, password, (response) => {
            if (!response) {
                res.send({
                    error: 'Incorrect username or password'
                })
            }
            else {
                jwt.sign({ username: username }, 'Some key', (err, token) => {
                    res.setHeader('Set-Cookie', cookie.serialize('jwt', token, {
                        maxAge: 60 * 60 * 24 * 7 // 1 week
                    }))
                    res.send({
                        error: ''
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