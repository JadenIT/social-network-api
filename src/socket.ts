const io = require('socket.io')
const jwt = require('jsonwebtoken')
const axios = require('axios')

import DialogController from './controllers/DialogController'
import Config from './config'
import MessageObject from './interfaces/MessageObject'

class Socket {
    socket: any;

    constructor(server: any) {
        this.socket = io(server);

        this.socket.on('connection', (client: any) => {
            client.on('joinRoom', (dialogID: any, username: any) => client.join(dialogID));
            client.on('msgToServer', (msgObj: any) => this.sendMessage(msgObj));
        })
    }

    private async sendMessage(msgObj: MessageObject) {
        const {message, room_id, token} = msgObj;
        try {
            const {username} = jwt.verify(token, Config.JWT_KEY);
            await DialogController.createMessage(room_id, message, username);
            msgObj.username = username;
            this.socket.to(room_id).emit('msgToClient', msgObj);
        } catch (e) {
            return this.socket.to(room_id).emit('error', 'error');
        }
    }
}

export default Socket
