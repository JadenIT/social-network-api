const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes/index')
const cookies = require('./middlewares/cookies')
const jwt = require('./middlewares/jwt')
let app = express()

app.use(cookies)
app.use(jwt)

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Headers', 'origin, content-type, accept');
    next()
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', router)

let server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${server.address().port}`)
})
