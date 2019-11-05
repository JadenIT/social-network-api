require('dotenv').config()
import Server from './server'

Server.app.listen(4000, () => console.log('1'))
