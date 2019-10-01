const router = require('express').Router()
const saveUser = require('./saveUser')
const authUser = require('./authUser')
const logoutUser = require('./logoutUser')
const authorize = require('./authorize')
const post = require('./post')

router.use('/', saveUser)
router.use('/', authUser)
router.use('/', logoutUser)
router.use('/', authorize)
router.use('/', post)

module.exports = router