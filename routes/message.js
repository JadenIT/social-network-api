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
                userController.addMessage(username, message, roomID, (response) => {
                    io.to(roomID).emit('msgToClient', msgObj);
                })
            }
        })
    })

    client.on('disconnect', () => { })

});
const port = 5000;

io.listen(port);

Router.post('/dialog', (req, res, next) => {
    const { users, token } = req.body
    jwt.verify(token, 'Some key', (err, decoded) => {
        if (decoded == null || decoded == undefined) {
            res.send({
                error: 'Incorrect JWT',
                dialogID: null
            })
        }
        else {
            userController.createDialog(users, (err, dialogID) => {
                res.send({
                    error: err,
                    dialogID: dialogID
                })
            })
        }
    })
})

Router.post('/addMessage', (req, res, next) => {
    const { usernameFrom, usernameTo, message, roomID } = req.body
    userController.addMessage(usernameFrom, usernameTo, message, roomID, (err) => {
        res.send({
            error: err
        })
    })
})

Router.get('/messages', (req, res, next) => {
    const { username } = req.query
    userController.getMessages(username, (response) => {
        res.send(response)
    })
})

Router.get('/dialog', (req, res, next) => {
    const { dialogID, token } = req.query
    jwt.verify(token, 'Some key', (err, decoded) => {
        if (decoded == null || decoded == undefined) {
            res.send({
                error: 'Incorrect JWT',
                dialog: []
            })
        }
        else {
            userController.getDialog(dialogID, decoded.username, (error, response) => {
                res.send({
                    error: error,
                    dialog: response
                })
            })
        }
    })
})

module.exports = Router