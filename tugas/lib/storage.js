const mime = require('mime-types');
// eslint-disable-next-line no-unused-vars
const { Readable } = require('stream');
const { Client } = require('minio');
require('dotenv').config();

/**
 * set MINIO_ROOT_USER=local-minio
 * set MINIO_ROOT_PASSWORD=local-test-secret
 */
const minioClient = new Client({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS,
  secretKey: process.env.MINIO_SECRET,
});

/**
 * generate random file name
 * @param {string} mimetype mimetype
 * @returns {string} generated file name
 */
function randomFileName(mimetype) {
  return (
    new Date().getTime() +
    '-' +
    Math.round(Math.random() * 1000) +
    '.' +
    mime.extension(mimetype)
  );
}

function saveFile(bucket, file, mimetype) {
  const destname = randomFileName(mimetype);
  return new Promise((resolve, reject) => {
    // Check Bucket
    minioClient.bucketExists(bucket, function (err, exists) {
      if (err) {
        throw err;
      }
      if (!exists) {
        minioClient.makeBucket('europetrip', 'us-east-1', function (err) {
          if (err) throw err;
          console.log('Bucket created successfully in "us-east-1".');
        });
      } else if (exists) {
        console.log('Bucket exists.');
      }
    });

    // Store File to Bucket
    client.putObject(bucket, destname, file, (err, etag) => {
      if (err) {
        reject(err);
      }
      resolve(destname);
    });
  });
}

module.exports = {
  saveFile,
};
