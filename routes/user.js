const Router = require('express').Router()
const userController = require('../controllers/userController')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const upload = require('../middlewares/storage')

Router.get('/user/:username', (req, res, next) => {
    const username = req.params.username
    userController.getPublicUser(username, (response) => res.send(response))
})


Router.post('/subscribe', (req, res, next) => {
    const { username, usernameToSubscribe } = req.body
    userController.subscribe(username, usernameToSubscribe, (response) => res.send(response))
})

Router.post('/unSubscribe', (req, res, next) => {
    const { username, usernameToUnSubscribe } = req.body
    userController.unSubscribe(username, usernameToUnSubscribe, (response) => res.send(response))
})

Router.post('/update', upload, (req, res, next) => {
    const { oldUsername, newUsername, newPassword, newAbout, newFullname } = req.body
    const newAvatar = req.files[0] || null
    const newAvatarFileName = newAvatar ? newAvatar.filename : null
    userController.updateUser(oldUsername, newUsername, newFullname, newPassword, newAbout, newAvatarFileName, (error, response) => {
        if (response) {
            jwt.sign({ username: newUsername }, 'Some key', (err, token) => {
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    maxAge: 60 * 60 * 24 * 7 // 1 week
                }))
                res.send('{}')
            })
        }
        else {
            res.send({
                error: error
            })
        }
    })
})


module.exports = Router