const router = require('express').Router()
const userController = require('../controllers/userController')
const upload = require('../middlewares/storage')
const fs = require('fs')

router.post('/post', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
            res.send({ status: 'error', error: 'Произошла ошибка, скорее всего файл слишком большой' })
        } else {
            const { text, username, token } = req.body
            const file = req.files[0] || null
            const timestamp = Date.now()

            let buffer

            if (file) {
                buffer = fs.readFileSync(`./uploads/${file.filename}`)
            }

            userController
                .savePost(username, text, timestamp, token, buffer)
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
