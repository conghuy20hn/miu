const db = require('../models');
const params = require('../config/params');
const VnConfig = require('../models/models_mxhvd/vn_config');
const redisService = require('../services/redis.service');
const obj = VnConfig(db.sequelize, db.DataTypes);
const redis = require('../config/redis');
exports.VnConfig = obj;

getConfigKey = async function (key, defaultValue = '') {

    if (params.configStr.cache_enabled == true) { //cache
        let dbRedis = redis.dbCache;
        let configValue = redisService.getKey(key, dbRedis);
        if (configValue == null) {
            configValue = getDbKey(key, defaultValue);
            //set cache
            redisService.setKey(key, configValue, redis.CACHE_10MINUTE, dbRedis);
        }
        return configValue;
    } else {
        return getDbKey(key, defaultValue); // not cache
    }
}

getDbKey = async function (key, defaultValue = '') {
    return new Promise(function (resolve, reject) {

        let where = {
            config_key: key,
        };
        let query = obj.findOne({
            where: where
        }).then(function (configs) {
            if (configs != null) {
                let obj = configs.dataValues;
                resolve(obj.config_value);
            } else {
                resolve(defaultValue);
            }
        }).catch(function (err) {
            console.log(err);
            resolve("");
        });
    });
}
exports.getConfigKey = getConfigKey;
