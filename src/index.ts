require('dotenv').config()

import server from './server'

server.listen(process.env.PORT || 8000)
