const router = require('express').Router()
const jwt = require('jsonwebtoken')

router.get('/authorize', (req, res, next) => {
    const { token } = req.cookies
    jwt.verify(token, 'Some key', (err, decoded) => {
        res.send({
            isAuthorized: decoded,
            token: token
        })
    })
})

module.exports = router