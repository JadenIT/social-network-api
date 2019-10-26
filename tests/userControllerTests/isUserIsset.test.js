require('dotenv').config()
const randomString = require('randomstring')
const userModel = require('../../models/userModel')
const userController = require('../../controllers/userController')

describe('isUserIsset()', () => {
    it('should return error', (done) => {
        userController
            .isUserIsset()
            .then((res) => {
                done(new Error('Error'))
            })
            .catch((err) => {
                done()
            })
    })
})
