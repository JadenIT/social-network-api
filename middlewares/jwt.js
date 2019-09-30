module.exports = function (req, res, next) {
    const { jwt } = req.cookies
    req.jwt = jwt
    next()
}

/* auth.js is dependency
 *
*/