"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var multer = require("multer");
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}
var storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        var newFileName = file.originalname.replace(/\s/g, '');
        var name = decodeURI(Date.now() + newFileName);
        cb(null, name);
    }
});
var checkFileType = function (file, cb) {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif') {
        cb(null, true);
    }
    else {
        cb('Incorrect type of file');
    }
};
var upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).any();
exports.default = upload;
