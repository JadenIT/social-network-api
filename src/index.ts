require('dotenv').config()

import server from './server'

console.log(process.env.PORT)

server.listen(process.env.PORT || 8000)

import bucketName from './controllers/GoogleCloud'

console.log(bucketName)
