const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/removeLike', (req, res, next) => {
    const { usernameID, usernamePostedPostID, postID, token } = req.body
    userController
        .removeLike(usernameID, usernamePostedPostID, postID, token)
        .then((response) => res.send(response))
        .catch((error) => res.send({ error: error }))
})

module.exports = router
