const db = require('../models');
const params = require('../config/params');
const VnConfig = require('../models/models_mxhvd/vn_config');
const redisService = require('../services/redis.service');
const obj = VnConfig(db.sequelize, db.DataTypes);
const redis = require('../config/redis');
const Utils = require('../lib/Utils');
exports.VnConfig = obj;

getConfigKey = async function (key, defaultValue = '') {

    if (params.configStr.cache_enabled == true) { //cache
        let dbRedis = redis.constant.dbCache;
        let keyExits = await redisService.exitsKey(key, dbRedis);
        let configValue = defaultValue;
        if (keyExits == false) {
            configValue = await this.getDbKey(key, defaultValue);
            await redisService.setKey(key, configValue, redis.constant.CACHE_10MINUTE, dbRedis);
        } else { // exist key
            await redisService.getKey(key, dbRedis);
        }
        return configValue;
    } else {

        return await this.getDbKey(key, defaultValue); // not cache
    }
}

exports.getDbKey = function (key, defaultValue = '') {
    return new Promise(function (resolve, reject) {
        let where = {
            config_key: key,
        };
        obj.findOne({
            where: where,
            raw: true
        }).then(function (configs) {

            if (configs != null) {

                resolve(configs['config_value']);
            } else {
                resolve(defaultValue);
            }
        }).catch(function (err) {
            console.log(err);
            resolve(defaultValue);
        });
    });
}
exports.getConfigKey = getConfigKey;
