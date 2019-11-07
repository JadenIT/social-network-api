require('dotenv').config()
const http = require('http')

import Server from './server'
import Socket from './socket'

var server = http.createServer(Server.app)
new Socket(server)

server.listen(process.env.PORT || 8000)
