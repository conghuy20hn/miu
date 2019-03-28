const crypto = require('crypto');
exports.getSecurePassword = function (password, salt, algo) {
    const algoFormatted = algo.toLowerCase().replace('-', '');
    const hash = crypto.createHmac(algoFormatted, salt);
    hash.update(password);

    const res = hash.digest('hex');

    return res;
}
