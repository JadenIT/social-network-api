const io = require('socket.io')
const jwt = require('jsonwebtoken')

import DialogController from './controllers/DialogController'
import Config from './config/index'

class Socket {
    socket: any

    constructor(port: any) {
        this.socket = io.listen(port)

        this.socket.on('connection', (client: any) => {
            client.on('joinRoom', (dialogID: any, username: any) => this.onJoinRoom(client, dialogID))
            client.on('msgToServer', (msgObj: any) => this.onMessage(client, this.socket, msgObj))
        })
    }

    private onMessage(client: any, socket: any, msgObj: any) {
        const { message, roomID, token } = msgObj
        jwt.verify(token, 'Some key', (err: any, decoded: any) => {
            if (!decoded) return socket.to(roomID).emit('error', 'incorrect jwt')
            const username = jwt.verify(token, Config.JWT_KEY, (err: any, decoded: any) => decoded.username)
            DialogController.createMessage(username, message, roomID)
                .then((res) => {
                    msgObj.username = decoded.username
                    socket.to(roomID).emit('msgToClient', msgObj)
                })
                .catch((err) => socket.to(roomID).emit('error', err))
        })
    }

    private onJoinRoom(client: any, dialogID: any) {
        client.join(dialogID)
    }
}

export default Socket
