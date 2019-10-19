const Router = require('express').Router()
const userController = require('../controllers/userController')

Router.get('/suggestion', (req, res, next) => {
    const { username } = req.query
    userController.suggestion(username, (error, response) => {
        res.send({
            error: error,
            suggestions: response
        })
    })
})

module.exports = Router