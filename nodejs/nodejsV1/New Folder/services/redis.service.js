
var redis = require('../config/redis').client;
var listDb = require('../config/redis').listDb;
var listKey = require('../config/redis').listKey;

exports.getKey = async function (keyRedis, db) {
    let val = await new Promise(function (resolve, reject) {
        try {
            redis.select(db);
            redis.get(keyRedis, function (err, data) {
                if (err) {
                    console.log(err);
                    resolve(null);
                } else {
                    resolve(data);
                }
            });
        } catch (e) {
            console.log(e);
            resolve(null);
        }
    });
    return val;
}


exports.setKey = async function (keyRedis, value, timeout, db) {

    let val = await new Promise(function (resolve, reject) {
        try {
            redis.select(db);
            let check = redis.set(keyRedis, value);
            if (timeout !== false) {
                redis.expire(keyRedis, parseInt(timeout));
            }
            if (check == true) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            console.log(e);
            resolve(false);
        }
    });
    return val;
}

exports.delKey = async function (keyRedis, db) {
    let val = await new Promise(function (resolve, reject) {
        try {
            redis.select(db);
            let del = redis.delete(keyRedis);
            resolve(del);
        } catch (e) {
            resolve(false);
        }
    });
    return val;
}
exports.exitsKey = async function (keyRedis, db) {
    let val = await new Promise(function (resolve, reject) {
        try {
            redis.select(db);
            let exits = redis.exists(keyRedis, function (err, reply) {
                if (reply === 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }

            });

        } catch (e) {
            resolve(false);
        }
    });
    return val;
}
