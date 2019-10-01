const router = require('express').Router()
const cookie = require('cookie')

router.post('/logout', (req, res, next) => {
    res.setHeader('Set-Cookie', cookie.serialize('token', null, {
                expires: new Date()
            }))
        if(req.cookies.jwt){
            res.send({
                error: 'Error'
            })
        }
        else{
            res.send({
                error: null
            })
        }
})

module.exports = router