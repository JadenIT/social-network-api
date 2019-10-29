const router = require('express').Router()
const userController = require('../controllers/userController')

router.get('/suggestion', (req, res, next) => {
    const { username } = req.query
    userController
        .suggestion(username)
        .then((suggestions) => res.send({ status: 'ok', suggestions }))
        .catch((error) => res.send({ status: 'error' }))
})

module.exports = router
