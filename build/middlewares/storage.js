Object.defineProperty(exports, "__esModule", { value: true });
var multer = require('multer');
var multerS3 = require('multer-s3');
var AWS = require('aws-sdk');
var fs = require('fs');
var config_1 = require("../config");
AWS.config.update({
    accessKeyId: config_1.default.AWS_ACCESS_KEY_ID,
    secretAccessKey: config_1.default.AWS_SECRET_KEY
});
var s3 = new AWS.S3();
var myBucket = config_1.default.AWS_BUCKET;
if (!fs.existsSync('./uploads'))
    fs.mkdirSync('./uploads');
var checkFileType = function (file, cb) {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif')
        return cb(null, true);
    cb('Incorrect type of file');
};
var storage = multerS3({
    s3: s3,
    bucket: myBucket,
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: '...' });
    },
    key: function (req, file, cb) {
        var fileName = (Date.now().toString() + file.originalname).replace(/\s/g, '');
        cb(null, fileName);
    }
});
var upload = multer({
    checkFileType: checkFileType,
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).any();
exports.default = upload;
