const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/unSubscribe', (req, res, next) => {
    const { username, usernameToUnSubscribe } = req.body
    userController
        .unSubscribe(username, usernameToUnSubscribe)
        .then((response) => res.send({ status: 'ok', response }))
        .catch((error) => res.send({ status: 'error' }))
})

module.exports = router
