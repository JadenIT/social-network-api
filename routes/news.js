const Router = require('express').Router()
const userController = require('../controllers/userController')

Router.get('/news', (req, res) => {
    const { username, page, perpage, token } = req.query
    userController
        .getNewsByUsername(username, page, perpage, token)
        .then((news) => res.send({ news }))
        .catch((error) => res.send({ status: 'error' }))
})

module.exports = Router
