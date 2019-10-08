const router = require('express').Router()
const saveUser = require('./saveUser')
const authUser = require('./authUser')
const logoutUser = require('./logoutUser')
const authorize = require('./authorize')
const post = require('./post')
const user = require('./user')
const news = require('./news')

router.use('/', saveUser)
router.use('/', authUser)
router.use('/', logoutUser)
router.use('/', authorize)
router.use('/', post)
router.use('/', user)
router.use('/', news)

module.exports = router