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
    const avatar = req.body.avatar
    const username = req.body.username
    const text = req.body.text
    const filename = req.files[0].filename || null
    if (!filename) res.send({ error: 'Error' }).end()
    if (req.authorized) {
        if (username == req.username) {
            /*  
                     *  req.username comes 
                     *  from  middleware jwt.js
                    */

            userController.savePost(username, filename, text, avatar, (err) => {
                if (err) throw err
            })
        }
    }
    res.send({ Error: '' }).end()
})

router.get('/posts/:username', (req, res, next) => {
    const username = req.params.username
    userController.getPublicUser(username, (response) => {
        res.send(response)
    })
})

module.exports = router