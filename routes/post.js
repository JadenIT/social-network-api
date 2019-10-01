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
    if (file.mimetype == 'image/png') {
        cb(null, true)
    }
    else {
        cb('Error incorrect type of file')
    }
}

router.post('/post', upload, (req, res, next) => {
    const filename = req.files[0].filename || null
    if (!filename) res.send({ error: 'Error' }).end()
    if (req.authorized) {
        userController.savePost(req.username, filename, (err) => {
            if (err) throw err
        })
    }
    res.send({ Error: '' }).end()
})

module.exports = router