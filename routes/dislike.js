const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/removeLike', (req, res, next) => {
    const { authUsername, username, postID, token } = req.body
    userController.removeLike(authUsername, username, postID, token)
        .then(response => res.send(response))
        .catch(error => res.send({ error: error }))
})

module.exports = router