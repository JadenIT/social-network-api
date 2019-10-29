const router = require('express').Router()
const userController = require('../controllers/userController')

router.get('/search', (req, res) => {
    const { query } = req.query
    userController.search(query)
        .then(docs => res.send({ search: docs }))
        .catch(error => res.send({ status: 'error' }))
})

module.exports = router