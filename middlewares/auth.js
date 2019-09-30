const jsonwebtoken = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const { jwt } = req
    try {
        jsonwebtoken.verify(jwt, 'Some key', (err, decoded) => {
            decoded == null || decoded == undefined ? res.redirect('/login') : next()
        })
    }
    catch (err) {
        throw err
    }
}