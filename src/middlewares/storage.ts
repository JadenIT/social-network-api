import * as fs from 'fs'
const multer = require('multer')

if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads')
}

var storage = multer.diskStorage({
    destination: './uploads',
    filename: function(req: any, file: any, cb: any) {
        const newFileName = file.originalname.replace(/\s/g, '')
        let name = decodeURI(Date.now() + newFileName)
        cb(null, name)
    }
})

const checkFileType = (file: any, cb: any) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif') return cb(null, true)
    cb('Incorrect type of file')
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: function(req: any, file: any, cb: any) {
        checkFileType(file, cb)
    }
}).any()

export default upload
