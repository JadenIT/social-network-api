const Router = require('express').Router()
const userController = require('../controllers/userController')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const upload = require('../middlewares/storage')

Router.get('/user/:username', (req, res, next) => {
    const username = req.params.username
    userController.getPublicUser(username)
        .then(response => res.send({ user: response }))
        .catch(error => res.send({ error }))
})

Router.post('/update', upload, (req, res, next) => {
    const { oldUsername, newUsername, newPassword, newAbout, newFullname } = req.body
    const newAvatar = req.files[0] || null
    const newAvatarFileName = newAvatar ? newAvatar.filename : null
    userController.updateUser(oldUsername, newUsername, newFullname, newPassword, newAbout, newAvatarFileName)
        .then(onResolved => {
            jwt.sign({ username: newUsername ? newUsername : oldUsername }, 'Some key', (err, token) => {
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    maxAge: 60 * 60 * 24 * 7 // 1 week
                }))
                res.send({})
            })
        }).catch(error => res.send({ error }))
})

Router.post('/user', (req, res, next) => {
    const { fullname, username, password } = req.body
    userController.save(fullname, username, password, 'defaultLogo.png')
        .then(onResolved => {
            jwt.sign({ username: username }, 'Some key', (err, token) => {
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    maxAge: 60 * 60 * 24 * 7 // 1 week
                }))
                res.send({})
            })
        }).catch(error => res.send({ error }))
})

module.exports = Router