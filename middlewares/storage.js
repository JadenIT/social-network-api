const multer = require('multer')

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
    limits: { fileSize: 2048000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb)
    }
}).any()

module.exports = upload
