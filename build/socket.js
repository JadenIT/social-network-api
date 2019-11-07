Object.defineProperty(exports, "__esModule", { value: true });
var io = require('socket.io');
var jwt = require('jsonwebtoken');
var DialogController_1 = require("./controllers/DialogController");
var index_1 = require("./config/index");
var Socket = (function () {
    function Socket(port) {
        var _this = this;
        this.socket = io.listen(port);
        this.socket.on('connection', function (client) {
            client.on('joinRoom', function (dialogID, username) { return _this.onJoinRoom(client, dialogID); });
            client.on('msgToServer', function (msgObj) { return _this.onMessage(client, _this.socket, msgObj); });
        });
    }
    Socket.prototype.onMessage = function (client, socket, msgObj) {
        var message = msgObj.message, roomID = msgObj.roomID, token = msgObj.token;
        jwt.verify(token, 'Some key', function (err, decoded) {
            if (!decoded)
                return socket.to(roomID).emit('error', 'incorrect jwt');
            var username = jwt.verify(token, index_1.default.JWT_KEY, function (err, decoded) { return decoded.username; });
            DialogController_1.default.createMessage(username, message, roomID)
                .then(function (res) {
                msgObj.username = decoded.username;
                socket.to(roomID).emit('msgToClient', msgObj);
            })
                .catch(function (err) { return socket.to(roomID).emit('error', err); });
        });
    };
    Socket.prototype.onJoinRoom = function (client, dialogID) {
        client.join(dialogID);
    };
    return Socket;
}());
exports.default = Socket;
