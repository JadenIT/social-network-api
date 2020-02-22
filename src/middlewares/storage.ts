const multer = require('multer')
const multerS3 = require('multer-s3')
var AWS = require('aws-sdk')
const fs = require('fs')

import Config from '../config'

AWS.config.update({
    accessKeyId: Config.AWS_ACCESS_KEY_ID,
    secretAccessKey: Config.AWS_SECRET_KEY
})

var s3 = new AWS.S3()
var myBucket = Config.AWS_BUCKET

if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads')

const checkFileType = (file: any, cb: any) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif') return cb(null, true)
    cb('Incorrect type of file')
}

var storage = multerS3({
    s3,
    bucket: myBucket,
    acl: 'public-read',
    metadata: function (req: any, file: any, cb: any) {
        cb(null, { fieldName: '...' })
    },
    key: function (req: any, file: any, cb: any) {
        const fileName = (Date.now().toString() + file.originalname).replace(/\s/g, '')
        cb(null, fileName)
    }
})

const upload = multer({
    checkFileType,
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function (req: any, file: any, cb: any) {
        checkFileType(file, cb)
    }
}).any()

export default upload
