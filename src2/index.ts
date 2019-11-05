require('dotenv').config()
import Server from './server'

Server.app.listen(8000, () => console.log('1'))
