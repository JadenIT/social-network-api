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

    userController.suggestion(username)
        .then(suggestions => res.send({ suggestions }))
        .catch(error => res.send({ error }))
})

module.exports = Router