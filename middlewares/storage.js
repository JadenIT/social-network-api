const multer = require('multer')

var storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        let name = decodeURI(Date.now())
        cb(null, name)
    }
})

const checkFileType = (file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif') {
        cb(null, true)
    }
    else {
        cb('Error incorrect type of file')
    }
}

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
}).any()

module.exports = upload