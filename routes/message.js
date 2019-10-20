const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/dialog', (req, res) => {
    const { users, token } = req.body
    userController.createDialog(users, token)
        .then(dialogID => res.send({ dialogID }))
        .catch(error => res.send({ error }))
})

router.get('/messages', (req, res) => {
    const { username, token } = req.query
    userController.getMessages(username, token)
        .then(dialogs => res.send({ dialogs }))
        .catch(error => res.send({ error }))
})

router.get('/dialog', (req, res) => {
    const { dialogID, token } = req.query
    userController.getDialog(dialogID, token)
        .then(dialog => res.send({ dialog }))
        .catch(error => res.send({ error }))
})

router.get('/messagesAmount', (req, res) => {
    const { username, dialogID } = req.query
    userController.messagesAmount(dialogID, username)
        .then(messages => res.send({ messages }))
        .catch(error => res.send({ error }))
})

router.get('/allMessagesAmount', (req, res) => {
    const { username } = req.query
    userController.allMessagesAmount(username)
        .then(messages => res.send({ messages }))
        .catch(error => res.send({ error }))
})

router.post('/dialogLastVisit', (req, res) => {
    const { dialogID, username } = req.body
    userController.dialogLastVisit(dialogID, username)
        .then(res => res.send({ status: 'ok' }))
        .catch(error => res.send({ error: error }))
})

router.post('/addMessage', (req, res) => {
    const { username, message, dialogID, token } = req.body
    userController.addMessage(username, message, dialogID, token)
        .then(resp => res.end({ status: 'ok' }))
        .catch(error => res.send({ error }))
})

module.exports = router