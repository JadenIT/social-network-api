const router = require('express').Router()
const multer = require('multer')
const userController = require('../controllers/userController')

var storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
}).any()

const checkFileType = (file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        cb(null, true)
    }
    else {
        cb('Error incorrect type of file')
    }
}

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