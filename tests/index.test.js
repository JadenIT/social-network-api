require('dotenv').config()
const randomString = require('randomstring')
const userModel = require('../models/userModel')
const userController = require('../controllers/userController')

describe('User Controller', () => {
    describe('Testing Registration', () => {
        it('Should give an error (Имя пользователя не заполнено)', (done) => {
            userController
                .save('fullName', null, 'password')
                .then((res) => {
                    done(new Error('Error'))
                })
                .catch((err) => {
                    expect(err).toBe('Имя пользователя не заполнено')
                    done()
                })
        })

        it('Should give an error (Имя не заполнено)', (done) => {
            userController
                .save(null, 'username', 'password')
                .then((res) => {
                    done(new Error('Error'))
                })
                .catch((err) => {
                    expect(err).toBe('Имя не заполнено')
                    done()
                })
        })

        it('Should give an error (Пароль не заполнен)', (done) => {
            userController
                .save('fullname', 'username', null)
                .then((res) => {
                    done(new Error('Error'))
                })
                .catch((err) => {
                    expect(err).toBe('Пароль не заполнен')
                    done()
                })
        })

        it('Should give an error', (done) => {
            userController
                .save()
                .then((res) => {
                    done(new Error('Error'))
                })
                .catch((err) => {
                    done()
                })
        })

        it('Should give an error', (done) => {
            userController
                .save()
                .then((res) => {
                    done(new Error('Error'))
                })
                .catch((err) => {
                    done()
                })
        })

        it('Should give an error', (done) => {
            userController
                .save()
                .then((res) => {
                    done(new Error('Error'))
                })
                .catch((err) => {
                    done()
                })
        })

        it('Should return error (Имя занято)', (done) => {
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
                        .save(randomFullname, randomUsername, randomPassword)
                        .then((res) => {
                            done(new Error('Error'))
                        })
                        .catch((err) => {
                            expect(err).toBe('Имя занято')
                            done()
                        })
                })
                .catch((err) => {
                    done(new Error('Error'))
                })
        })

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

        it('Should return (Incorrect username)', (done) => {
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
                    const newRandomUsername = randomString.generate(27)
                    const newRandomPassword = randomString.generate(27)
                    userController
                        .isUserIsset(newRandomUsername, newRandomPassword)
                        .then((res) => {
                            done(new Error('Error'))
                        })
                        .catch((err) => {
                            expect(err).toBe('Incorrect username')
                            done()
                        })
                })
                .catch((err) => {
                    done(new Error('Error'))
                })
        })

        it('Should return (Incorrect password)', (done) => {
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
                    const newRandomPassword = randomString.generate(27)
                    userController
                        .isUserIsset(randomUsername, newRandomPassword)
                        .then((res) => {
                            done(new Error('Error'))
                        })
                        .catch((err) => {
                            expect(err).toBe('Incorrect password')
                            done()
                        })
                })
                .catch((err) => {
                    done(new Error('Error'))
                })
        })
    })
})
