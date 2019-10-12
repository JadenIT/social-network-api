const Router = require('express').Router()
const userController = require('../controllers/userController')

Router.get('/news', (req, res) => {
    const { username, page, perpage, token } = req.query
    userController.getNewsByUsername(username, page, perpage, token, (error, news) => {
        res.send({
            error: error,
            news: news
        })
    })
})

module.exports = Router