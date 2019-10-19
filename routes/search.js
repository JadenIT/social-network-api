const Router = require('express').Router()
const userController = require('../controllers/userController')

Router.get('/search', (req, res) => {
    const { query } = req.query
    userController.search(query)
        .then(docs => res.send({ search: docs }))
        .catch(error => res.send({ error }))
})

module.exports = Router