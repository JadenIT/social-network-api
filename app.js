require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes/index')
const cookies = require('./middlewares/cookies')

let app = express()

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next()
})

app.use(express.static(__dirname));
app.use(cookies)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', router)

let server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${server.address().port}`)
})
