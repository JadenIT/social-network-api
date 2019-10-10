const Router = require('express').Router()
const userController = require('../controllers/userController')

const io = require('socket.io')();

io.on('connection', (client) => {

    client.on('joinRoom', (room) => {
        client.join(room);
    })

    client.on('msgToServer', (msgObj) => {
        const { username, message, roomID } = msgObj
        userController.addMessage(username, message, roomID, (response) => {
            io.to(roomID).emit('msgToClient', msgObj);
        })
    })

    client.on('disconnect', () => { })

});
const port = 5000;

io.listen(port);

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