const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/addLike', (req, res, next) => {
    const { authUsername, username, postID, token } = req.body
    userController.addLike(authUsername, username, postID, token)
        .then(Response => res.send(Response))
        .catch(cerror => res.send({ error }))
})

module.exports = router