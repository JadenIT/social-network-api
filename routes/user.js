const Router = require('express').Router()
const userController = require('../controllers/userController')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const multer = require('multer')

Router.get('/user/:username', (req, res, next) => {
    const username = req.params.username
    userController.getPublicUser(username, (response) => {
        res.send(response)
    })
})

Router.post('/subscribe', (req, res, next) => {
    const { username, usernameToSubscribe } = req.body
    userController.subscribe(username, usernameToSubscribe, (response) => {
        res.send(response)
    })
})

Router.post('/unSubscribe', (req, res, next) => {
    const { username, usernameToUnSubscribe } = req.body
    userController.unSubscribe(username, usernameToUnSubscribe, (response) => {
        res.send(response)
    })
})

var storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        let name = decodeURI(Date.now())
        cb(null, name)
    }
})

const checkFileType = (file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif') {
        cb(null, true)
    }
    else {
        cb('Error incorrect type of file')
    }
}

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
}).any()

Router.post('/update', upload, (req, res, next) => {
    const { oldUsername, newUsername, newPassword, newAbout, newFullname } = req.body
    const newAvatar = req.files[0] || null
    const newAvatarFileName = newAvatar ? newAvatar.filename : null
    userController.updateUser(oldUsername, newUsername, newFullname, newPassword, newAbout, newAvatarFileName, (response) => {
        if (response) {
            jwt.sign({ username: newUsername }, 'Some key', (err, token) => {
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    maxAge: 60 * 60 * 24 * 7 // 1 week
                }))
                res.send({
                    error: ''
                })
            })
        }
    })
})

module.exports = Router