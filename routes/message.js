const Router = require('express').Router()
const userController = require('../controllers/userController')

Router.post('/dialog', (req, res) => {
    const { users, token } = req.body
    userController.createDialog(users, token)
        .then(dialogID => res.send({ dialogID }))
        .catch(error => res.send({ error }))
})

Router.get('/messages', (req, res) => {
    const { username, token } = req.query
    userController.getMessages(username, token)
        .then(dialogs => res.send({ dialogs }))
        .catch(error => res.send({ error }))
})

Router.get('/dialog', (req, res) => {
    const { dialogID, token } = req.query
    userController.getDialog(dialogID, token)
        .then(dialog => res.send({ dialog }))
        .catch(error => res.send({ error }))
})

module.exports = Router