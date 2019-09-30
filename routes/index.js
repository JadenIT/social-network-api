const router = require('express').Router()
const saveUser = require('./saveUser')
const authUser = require('./authUser')
const logoutUser = require('./logoutUser')

router.use('/', saveUser)
router.use('/', authUser)
router.use('/', logoutUser)

module.exports = router