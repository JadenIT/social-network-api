Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = require("@google-cloud/storage");
exports.saveFile = function (content, fileName) {
    var storage = new storage_1.Storage({
        credentials: {
            type: "service_account",
            project_id: "strategic-well-303919",
            private_key_id: "3c230e45135d82a2f786a49eaa63cdd1bcc5661e",
            private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCm+/nOVR5esov+\nK++nFXt2ECwNuKi5NgiYglSU1+NoOYXh4SQWzqdLJ5aokZFKY/BEwYq4HOLTpsuL\nY88LrG0a1HITUa1cXk0SIuh2ueEaomysTLvzfnWdTORkxwTRLXg4SHZl7LJl6XIE\nRejp4ApbqW0c/kCXioGfQ4fDcH/k2z2lFVcONOMnXqTrRyHi+J1fTWdP1bhpIWmO\nu7d4cmYMc+sC2zP0xuQg54lcUV+KG7sOG9AtokKKa28mvHBbRT83TGjEJX3pHl+A\nvOlXMiDJ2A7HquZeXOR/dfQjhSAeBQz4HZ6s4ewcUae5YJr2Qtt5hYEG9gsrC2wT\nhP16keVTAgMBAAECggEAODKFF9O9rNEaHChdNzYbnthCezuyTOLKcckq/gzKE8GI\nNUS4CJTz6G8iXQjghNCtg/Y+4UeXbvOrfPXSMHOPJIBrA+VxGq0B8yCca5iTEYuo\nVzRb7M6adp3yH5h7HorW8towPo0yXOn73URJ5qvn0IFsn11SD64lgZwQjM3HvRUg\nTkizQi9wRjSWlClN2IQfiHTj+cuu3jWzNlCQDw7vHdOjIunMPIbCN3RM6SUIa3La\nfitEMbbruLN2nJjtC78Rj9xJ6dpjMlozP/dFRS1xfKAQWTmmvyNEylotR0o9eKmf\nYzmBaVO0cKqmRomR3wRUInhNX0OOqsgyVNJgo95dAQKBgQDfQYPOS5W0EvqFMWAs\nhASPpLpDBQNIcnCbFVTYq4L0sBxYLV+iFkmfOP4qRjgKjANXyaOTYJKf762ouKEA\n8X4sUi8y0Yp6pYNbbNuRRcViP1AQc/y0hGU4E9Gkutq0ClM9647hH50dk1WFF/OE\nrtK30gRVN/coZbYW+AKVxO02kQKBgQC/eaf8s7vY8B8T1QRevV0SUYFDIp61rOk+\n396UJl2urqwPXmLJme2LfwDQHrY88AlGv8540fI64+uPdaI9roj8QDq3x6gjtUoq\n3Z+6WXLLnBAPfXEYxYQd6pYDzud3F8pqJxqGjI81jYubmzTnwIqQ9UPjkqEgcg5V\nDJkXUV83owKBgQCCihw3k5qFIFO7bZN+c/L2yqreZR/2THPrOh3SUvbPe+oW5PD2\nJXIG15xFu6kpAZUyz4QFuIIDYnF4Jfx+QLY11Bgk7sC51e1ol84Ks3EmcT6vYCJy\nqrdEgtIiL9+RRjhGDGYO3B1SHcPzfn21J0Oul+5QpdiulkpSQ9G/INZTAQKBgB04\nInOEtgjP894h5q3Sde6Cs5gcI14UCfAHV78B78/lZepee/LJ458i/WvFFAhOlQvP\n32E+oJluCJd22xBQnyTnZE6BUF5KnwvVkDduyP7bTPQgL28ZTSUHlGb2XwokfkYe\nu4SG1J/WftR7JeKr1jlyxC5pRN9fqGJALuiJCV/DAoGAJ00Z0w8i18xiJWMDN4Jb\nmvCOVoz8iUlj8eREyzN1ZYcm1mi0QwQCxPjIk3P4kSsRpg8dKS/jW55B+IFpL8kx\nUKdMr7XUMCNBlZdVgQhA628AR0F8eZLEd+RucfxgZpcp/OThAPo4rLZLC1a2vVUy\nmJw7ZibuJ/biaAT+8NU2NfM=\n-----END PRIVATE KEY-----\n",
            client_email: "serviceaccount1@strategic-well-303919.iam.gserviceaccount.com",
            client_id: "106694299748083276069",
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/serviceaccount1%40strategic-well-303919.iam.gserviceaccount.com"
        }
    });
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
