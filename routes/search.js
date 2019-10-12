const Router = require('express').Router()
const userController = require('../controllers/userController')

Router.get('/search', (req, res) => {
    const { query } = req.query
    userController.search(query, (error, response) => {
        res.send({
            error: error,
            search: response
        })
    })
})

module.exports = Router