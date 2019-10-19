const router = require('express').Router()

router.post('/unSubscribe', (req, res, next) => {
    const { username, usernameToUnSubscribe } = req.body
    userController.unSubscribe(username, usernameToUnSubscribe)
        .then(response => res.send({ response }))
        .catch(error => res.send({ error }))
})

module.exports = router