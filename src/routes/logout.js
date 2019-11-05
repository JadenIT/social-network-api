const router = require('express').Router()
const cookie = require('cookie')

router.post('/logout', (req, res, next) => {
    res.setHeader('Set-Cookie', cookie.serialize('token', null, {
        expires: new Date()
    }))
    if (req.cookies.jwt) return res.send({ error: 'Error' })
    res.send({ error: null })
})

module.exports = router