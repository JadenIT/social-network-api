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
                userController.addMessage(username, message, roomID, token, (error) => {
                    if (error) {
                        io.to(roomID).emit('error', error)
                    }
                    else {
                        io.to(roomID).emit('msgToClient', msgObj)
                    }
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
    userController.createDialog(users, token, (err, dialogID) => {
        res.send({
            error: err,
            dialogID: dialogID
        })
    })
})

Router.get('/messages', (req, res) => {
    const { username, token } = req.query
    userController.getMessages(username, token, (error, dialogs) => {
        res.send({
            error: error,
            dialogs: dialogs
        })
    })
})

Router.get('/dialog', (req, res) => {
    const { dialogID, token } = req.query
    userController.getDialog(dialogID, token, (error, response) => {
        res.send({
            error: error,
            dialog: response
        })
    })
})

module.exports = Router