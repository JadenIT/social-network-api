const Router = require('express').Router()
const userController = require('../controllers/userController')

Router.post('/addMessage', (req, res, next) => {
    const { usernameFrom, usernameTo, message } = req.body
    userController.addMessage(usernameFrom, usernameTo, message, (err) => {
        res.send({
            error: err
        })
    })
})

Router.get('/messages', (req, res, next) => {
    const { username } = req.query
    userController.getMessages(username, (response) => {
        res.send({
            messages: response
        })
    })
})

Router.get('/dialog', (req, res, next) => {
    const { dialogID } = req.query
    userController.getDialog(dialogID, (response) => {
        res.send({
            dialog: response
        })
    })
})

module.exports = Router