const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/subscribe', (req, res, next) => {
    const { username, usernameToSubscribe } = req.body
    userController.subscribe(username, usernameToSubscribe)
        .then(response => res.send({ response }))
        .catch(error => res.send({ error }))
})

module.exports = router
