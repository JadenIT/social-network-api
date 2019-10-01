const router = require('express').Router()
const userController = require('../controllers/userController')

router.get('/authorize', (req, res, next) => {
    userController.isAuthorized(req.token, (response) => {
        res.send({
            isAuthorized: response,
            token: req.token
        })
    })
})

module.exports = router