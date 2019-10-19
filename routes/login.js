const router = require('express').Router()
const userController = require('../controllers/userController')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

router.post('/login', (req, res, next) => {
    const { username, password } = req.body

    userController.isUserIsset(username, password)
        .then(onResolved => {
            jwt.sign({ username: username }, 'Some key', (err, token) => {
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    maxAge: 60 * 60 * 24 * 7
                }))
                res.send({})
            })
        })
        .catch(error => res.send({ error }))
})

module.exports = router