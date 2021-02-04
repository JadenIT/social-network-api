import { Storage } from '@google-cloud/storage'


export const saveFile = (content, fileName) => {

    const storage = new Storage();

    const myBucket = storage.bucket('example_bucket_16_01');

    const file = myBucket.file(fileName);
    const contents = content;

    file.save(contents, function (err) {
        console.log(err)
        if (!err) {
            console.log('done')
        }
    });

    file.save(contents).then(function () { });
}


// const storage = new Storage();

// const myBucket = storage.bucket('example_bucket_16_01');

// const file = myBucket.file('fileName');
// const contents = 'content';

// file.save(contents, function (err) {
//     console.log(err)
//     if (!err) {
//         console.log('done')
//     }
// });

// file.save(contents).then(function () { });