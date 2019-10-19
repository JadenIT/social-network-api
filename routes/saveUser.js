const router = require('express').Router()
const userController = require('../controllers/userController')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

router.post('/user', (req, res, next) => {
    const { fullname, username, password } = req.body
    userController.save(fullname, username, password, 'defaultLogo.png', (error) => {
        if (error) return res.send({ error })
        jwt.sign({ username: username }, 'Some key', (err, token) => {
            res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                maxAge: 60 * 60 * 24 * 7 // 1 week
            }))
            res.send({ error })
        })
    })
})

module.exports = router