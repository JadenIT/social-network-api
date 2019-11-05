require('dotenv').config()
const randomString = require('randomstring')
const userModel = require('../../models/userModel')
const userController = require('../../controllers/userController')
const jsonwebtoken = require('jsonwebtoken')

describe('savePost()', () => {
    it('should return (Not authorized)', (done) => {
        const randomUsername = randomString.generate(17)
        const randomFilename = randomString.generate(17)
        const randomText = randomString.generate(17)
        const randomJWTKey = randomString.generate(7)
        const randomToken = jsonwebtoken.sign({ username: 'bar' }, randomJWTKey)
        userController
            .savePost(randomUsername, randomFilename, randomText, 'defaults/defaultLogo.png', Date.now(), randomToken)
            .then((res) => {
                done(new Error('Error'))
            })
            .catch((err) => {
                expect(err).toBe('Not authorized')
                done()
            })
    })
    it('should return (Token username doesn"t match username from req)', (done) => {
        const randomUsername = randomString.generate(17)
        const randomFilename = randomString.generate(17)
        const randomText = randomString.generate(17)
        const randomToken = jsonwebtoken.sign({ foo: 'bar' }, process.env.JWT_KEY)
        userController
            .savePost(randomUsername, randomFilename, randomText, 'defaults/defaultLogo.png', Date.now(), randomToken)
            .then((res) => {
                done(new Error('Error'))
            })
            .catch((err) => {
                expect(err).toBe("Token username doesn't match username from req")
                done()
            })
    })

    it('should save post', (done) => {
        const randomUsername = randomString.generate(17)
        const randomFilename = randomString.generate(17)
        const randomfullname = randomString.generate(17)
        const randomPassword = randomString.generate(17)
        const randomText = randomString.generate(17)
        const date = Date.now()
        const randomToken = jsonwebtoken.sign({ username: randomUsername }, process.env.JWT_KEY)
        userController
            .save(randomfullname, randomUsername, randomPassword)
            .then((res) => {
                userController
                    .savePost(randomUsername, randomFilename, randomText, 'defaults/defaultLogo.png', date, randomToken)
                    .then((res) => {
                        userModel
                            .findOne({ username: randomUsername }, { posts: 1 })
                            .then((res) => {
                                if (
                                    res.posts.some((el) => {
                                        return (
                                            el.filename == randomFilename &&
                                            el.text == randomText &&
                                            el.username == randomUsername &&
                                            el.timestamp == date &&
                                            el.likedBy.length == 0 &&
                                            el.avatar == 'defaults/defaultLogo.png'
                                        )
                                    })
                                ) {
                                    done()
                                } else {
                                    done(new Error('Error'))
                                }
                            })
                            .catch((err) => {
                                done(new Error('Error'))
                            })
                    })
                    .catch((err) => {
                        console.log(err)
                        done(new Error('Error'))
                    })
            })
            .catch((err) => {
                done(new Error('Error'))
            })
    })
})
