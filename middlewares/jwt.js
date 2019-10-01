const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const { token } = req.cookies

    jwt.verify(token, 'Some key', function (err, response) {
        req.username = response.username || ''
        req.token = token
        response ? req.authorized = true : req.authorized = false
    })
    next()
}