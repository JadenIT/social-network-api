import * as fs from 'fs'
import * as multer from 'multer'

if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads')
}

var storage = multer.diskStorage({
    destination: './uploads',
    filename: function(req, file, cb) {
        const newFileName = file.originalname.replace(/\s/g, '')
        let name = decodeURI(Date.now() + newFileName)
        cb(null, name)
    }
})

const checkFileType = (file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif') {
        cb(null, true)
    } else {
        cb('Incorrect type of file')
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb)
    }
}).any()

export default upload
