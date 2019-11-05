const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/addLike', (req, res, next) => {
    const { usernameID, usernamePostedPostID, postID, token } = req.body
    userController
        .addLike(usernameID, usernamePostedPostID, postID, token)
        .then((Response) => res.send({ status: Response }))
        .catch((error) => res.send({ error }))
})

module.exports = router
