const router = require('express').Router()
const jwt = require('jsonwebtoken')

router.get('/authorize', (req, res, next) => {
    const { token } = req.cookies

    if (!token) return res.send({ isAuthorized: false, token: null })
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) throw err
        res.send({
            isAuthorized: decoded,
            token: token
        })
    })
})

module.exports = router
