const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/unSubscribe', (req, res, next) => {
    const { usernameID, usernameToSubscribeID } = req.body
    userController
        .unSubscribe(usernameID, usernameToSubscribeID)
        .then((response) => res.send({ status: 'ok', response }))
        .catch((error) => res.send({ status: 'error' }))
})

module.exports = router
