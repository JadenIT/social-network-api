const router = require('express').Router()
const userController = require('../controllers/userController')

router.get('/subscriptions', (req, res) => {
    const { username } = req.query
    userController
        .getSubscriptionsByUsername(username)
        .then((subscriptions) => {
            res.send({
                subscriptions
            })
        })
        .catch((error) => res.send({ error: error }))
})

module.exports = router
