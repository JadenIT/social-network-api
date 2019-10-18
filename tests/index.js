const userController = require('../controllers/userController')
const assert = require('assert');
const expect = require('expect')

describe('User Controller', () => {
    // describe('usernameIsFree', () => {

    //     it('String', function (done) {
    //         this.timeout(5000);
    //         userController.usernameIsFree('a`L;', (res) => {
    //             if (res || !res) return done()
    //             done(new Error("Some error"));
    //         })
    //     });

    //     it('Number', function (done) {
    //         this.timeout(5000);
    //         userController.usernameIsFree(756234, (res) => {
    //             if (res || !res) return done()
    //             done(new Error("Some error"));
    //         })
    //     });

    // })

    describe('Save user', (done => {
        userController.save('asd', 'sdsd', 'sd', 'sd', (error, doc) => {
            if(error) return done(new Error(error))
            assert.equal(doc.username, 'sdsd')
        })
    }))
})