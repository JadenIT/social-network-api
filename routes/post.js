const router = require('express').Router()
const userController = require('../controllers/userController')
const upload = require('../middlewares/storage')
const fs = require('fs')

router.post('/post', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' })
        } else {
            const { text, avatar, username, token } = req.body
            const file = req.files[0] || null
            const timestamp = Date.now()

            let buffer
            let filename

            if (file) {
                filename = file.filename
                buffer = fs.readFileSync(`./uploads/${filename}`)
            }

            userController
                .savePost(username, text, avatar, timestamp, token, buffer)
                .then((onResolved) => {
                    res.send({ status: 'ok' })
                })
                .catch((error) => {
                    res.send({ status: 'error' })
                })
        }
    })
})

module.exports = router
