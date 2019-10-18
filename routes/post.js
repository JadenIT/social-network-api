const router = require('express').Router()
const userController = require('../controllers/userController')
const upload = require('../middlewares/storage')

router.post('/post', upload, (req, res, next) => {
    const { text, avatar, username, token } = req.body
    const file = req.files[0] || null
    const filename = file ? file.filename : null
    const timestamp = Date.now()
    userController.savePost(username, filename, text, avatar, timestamp, token, (error) => {
        res.send({
            error: error
        })
    })
})

router.post('/removePost', (req, res, next) => {
    userController.removePost(req.body.username, req.body.postID, (response) => {
        res.send(response)
    })
})

router.post('/addLike', (req, res, next) => {
    const { authUsername, username, postID, token } = req.body
    userController.addLike(authUsername, username, postID, token, (error) => {
        res.send({
            error: error
        })
    })

})

router.post('/removeLike', (req, res, next) => {
    const { authUsername, username, postID, token } = req.body
    userController.removeLike(authUsername, username, postID, token, (error) => {
        res.send({
            error: error
        })
    })

})


module.exports = router