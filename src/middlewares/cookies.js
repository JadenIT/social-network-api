const cookie = require('cookie')

module.exports = function (req, res, next) {
    req.cookies = cookie.parse(req.headers.cookie || '')
    next()
}