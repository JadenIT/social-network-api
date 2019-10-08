const Router = require('express').Router()
const userController = require('../controllers/userController')

Router.get('/news', (req, res, next) => {
    const { username, page, perpage } = req.query
    userController.getNewsByUsername(username, page, perpage, (news) => {
        res.send({news: news})
    })
})

module.exports = Router