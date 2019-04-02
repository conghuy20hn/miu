var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
const params = require('../../config/params');
const { writeFileSync } = require('fs')
const { generateKeyPairSync } = require('crypto')
var encryptStringWithRsaPublicKey = function (toEncrypt, relativeOrAbsolutePathToPublicKey) {
    var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
    var publicKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = Buffer.from(toEncrypt);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};

var decryptStringWithRsaPrivateKey = function (toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
    var absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
    var privateKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = Buffer.from(toDecrypt, "base64");
    var decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString("utf8");
};
var encrypt = function (toEncrypt) {
    var relativeOrAbsolutePathToPublicKey = params.configStr.publicKey;
    return this.encryptStringWithRsaPublicKey(toEncrypt, relativeOrAbsolutePathToPublicKey);
}
var decrypt = function (toDecrypt) {
    var relativeOrAbsolutePathtoPrivateKey = params.configStr.privateKey;
    return this.decryptStringWithRsaPrivateKey(toDecrypt, relativeOrAbsolutePathtoPrivateKey);
}

function generateKeys() {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: '',
        },
    })
    //    console.log(path.dirname('config'));
    writeFileSync('private.pem', privateKey)
    writeFileSync('public.pem', publicKey)
}

module.exports = {
    encryptStringWithRsaPublicKey: encryptStringWithRsaPublicKey,
    decryptStringWithRsaPrivateKey: decryptStringWithRsaPrivateKey,
    generateKeys: generateKeys,
    encrypt: encrypt,
    decrypt: decrypt
}