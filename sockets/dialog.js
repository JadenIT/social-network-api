// const io = require('socket.io')();
// const userController = require('../controllers/userController')
// const jwt = require('jsonwebtoken')

// io.on('connection', (client) => {

//     client.on('joinRoom', (dialogID, username) => {
//         client.join(dialogID)
//         userController.dialogLastVisit(dialogID, username)
//             .then(res => { })
//             .catch(error => { })
//     })

//     client.on('msgToServer', (msgObj) => {
//         const { username, message, roomID, token } = msgObj
//         jwt.verify(token, 'Some key', (err, decoded) => {
//             if (!decoded) return io.to(roomID).emit('error', 'incorrect jwt')
//             userController.addMessage(username, message, roomID, token)
//                 .then(resolved => io.to(roomID).emit('msgToClient', msgObj))
//                 .catch(error => io.to(roomID).emit('error', error))
//         })
//     })
//     client.on('disconnect', () => { })
// })

// const port = 5000

// io.listen(port)