const Router = require('express').Router()
const userController = require('../controllers/userController')
const jwt = require('jsonwebtoken')

const io = require('socket.io')();

io.on('connection', (client) => {

    client.on('joinRoom', (room) => {
        client.join(room);
    })

    client.on('msgToServer', (msgObj) => {
        const { username, message, roomID, token } = msgObj
        jwt.verify(token, 'Some key', (err, decoded) => {
            if (decoded == null || decoded == undefined) {
                io.to(roomID).emit('error', 'incorrect jwt')
            }
            else {
                userController.addMessage(username, message, roomID, token)
                    .then(resolved => {
                        io.to(roomID).emit('msgToClient', msgObj)
                    })
                    .catch(error => {
                        io.to(roomID).emit('error', error)
                    })
            }
        })
    })
    client.on('disconnect', () => { })
})

const port = 5000

io.listen(port)

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