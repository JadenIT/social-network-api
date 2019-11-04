const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/subscribe', (req, res, next) => {
    const { usernameID, usernameToSubscribeID } = req.body
    userController
        .subscribe(usernameID, usernameToSubscribeID)
        .then((response) => res.send({ response }))
        .catch((error) => res.send({ status: 'error' }))
})

module.exports = router
