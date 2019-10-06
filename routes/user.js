const Router = require('express').Router()
const userController = require('../controllers/userController')

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
        console.log(response)
    })
    res.send('1')
})

module.exports = Router