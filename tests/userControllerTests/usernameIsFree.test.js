require('dotenv').config()
const randomString = require('randomstring')
const userModel = require('../../models/userModel')
const userController = require('../../controllers/userController')

describe('usernameIsFree()', () => {
    it('Should return false (usernameIsFree)', (done) => {
        const randomUsername = randomString.generate(17)
        const randomFullname = randomString.generate(17)
        const randomPassword = randomString.generate(17)
        new userModel({
            username: randomUsername,
            fullname: randomFullname,
            password: randomPassword
        })
            .save()
            .then((res) => {
                userController
                    .usernameIsFree(randomUsername)
                    .then((res) => {
                        expect(res).toBe(false)
                        done()
                    })
                    .catch((err) => {
                        done(new Error('Error'))
                    })
            })
            .catch((err) => {
                done(new Error('Error'))
            })
    })

    it('Should return true (usernameIsFree)', (done) => {
        const randomUsername = randomString.generate(17)
        userController
            .usernameIsFree(randomUsername)
            .then((res) => {
                expect(res).toBe(true)
                done()
            })
            .catch((err) => {
                done(new Error('Error'))
            })
    })
})
