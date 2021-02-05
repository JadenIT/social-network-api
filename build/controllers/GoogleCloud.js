Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = require("@google-cloud/storage");
exports.saveFile = function (content, fileName) {
    var storage = new storage_1.Storage();
    var myBucket = storage.bucket('example_bucket_16_01_2');
    var file = myBucket.file(fileName);
    var contents = content;
    file.save(contents, function (err) {
        console.log(err);
        if (!err) {
            console.log('done');
        }
    });
    file.save(contents).then(function () { });
};
