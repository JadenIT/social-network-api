const router = require('express').Router()
const cookie = require('cookie')

router.post('/logout', (req, res, next) => {
    res.setHeader('Set-Cookie', cookie.serialize('jwt', null, {
                expires: new Date()
            }))
        if(req.cookies.jwt){
            res.send({
                error: 'Error'
            })
        }
        else{
            res.send({
                error: ''
            })
        }
})

module.exports = router