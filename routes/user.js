const router = require('express').Router()
const userController = require('../controllers/userController')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const upload = require('../middlewares/storage')
const fs = require('fs')

router.get('/user/:username', (req, res, next) => {
    const username = req.params.username
    userController
        .getPublicUser(username)
        .then((response) => res.send({ user: response }))
        .catch((error) => res.send({ error }))
})

router.post('/update', (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' })
        } else {
            const { oldUsername, newUsername, newPassword, newAbout, newFullname } = req.body
            const newAvatar = req.files[0] || null
            let avatarBuffer
            if (newAvatar) {
                avatarBuffer = fs.readFileSync(`./uploads/${newAvatar.filename}`)
            }

            userController
                .updateUser(oldUsername, newUsername, newFullname, newPassword, newAbout, avatarBuffer)
                .then((onResolved) => {
                    jwt.sign({ username: newUsername ? newUsername : oldUsername }, process.env.JWT_KEY, (err, token) => {
                        res.setHeader(
                            'Set-Cookie',
                            cookie.serialize('token', token, {
                                maxAge: 60 * 60 * 24 * 7 // 1 week
                            })
                        )
                        res.send({ status: 'ok' })
                    })
                })
                .catch((error) => {
                    res.send({ status: 'error', error: 'error' })
                })
        }
    })
})

router.post('/user', (req, res, next) => {
    const { fullname, username, password } = req.body
    userController
        .save(fullname, username, password)
        .then((onResolved) => {
            jwt.sign({ username: username }, process.env.JWT_KEY, (err, token) => {
                res.setHeader(
                    'Set-Cookie',
                    cookie.serialize('token', token, {
                        maxAge: 60 * 60 * 24 * 7 // 1 week
                    })
                )
                res.send({ status: 'ok' })
            })
        })
        .catch((error) => res.send({ status: 'error', error: error }))
})

module.exports = router
