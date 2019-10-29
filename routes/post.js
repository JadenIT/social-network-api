const router = require('express').Router()
const userController = require('../controllers/userController')
const upload = require('../middlewares/storage')

router.post('/post', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send({ status: 'error' })
        } else {
            const { text, avatar, username, token } = req.body
            const file = req.files[0] || null
            const filename = file ? file.filename : null
            const timestamp = Date.now()

            userController
                .savePost(username, filename, text, avatar, timestamp, token)
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
