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
    const { text, avatar, username } = req.body
    const file = req.files[0] || null
    const filename = file ? file.filename : null
    if (req.authorized) {
        if (username == req.username) {
            const timestamp = Date.now()
            userController.savePost(username, filename, text, avatar, timestamp, (err) => {
                if (err) throw err
            })
        }
    }
    res.send({ Error: '' }).end()
})

router.post('/removePost', (req, res, next) => {
    userController.removePost(req.body.username, req.body.postID, (response) => {
        res.send(response)
    })
})

router.post('/addLike', (req, res, next) => {
    const { authUsername, username, postID } = req.body
    userController.addLike(authUsername, username, postID, (err) => {
        res.send({
            error: err
        })
    })

})

router.post('/removeLike', (req, res, next) => {
    const { authUsername, username, postID } = req.body
    userController.removeLike(authUsername, username, postID, (err) => {
        res.send({
            error: err
        })
    })

})


module.exports = router