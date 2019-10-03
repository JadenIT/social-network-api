const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const { token } = req.cookies

    jwt.verify(token, 'Some key', function (err, response) {
        if (response) {
            req.username = response.username || ''
            req.token = token
            req.authorized = true
        }
        else{ req.authorized = false }
    })
    next()
}