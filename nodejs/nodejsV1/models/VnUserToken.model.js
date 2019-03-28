const db = require('.');
const VnUserTokenBase = require('./models_mxhvd/vn_user_token');
const VnUserToken = VnUserTokenBase(db.sequelize, db.DataTypes);
const Utils = require('../lib/Utils');

exports.getByUserByQuery = async function (query) {
    return new Promise(function (resolve, reject) {
        VnUserToken.findOne({
            where: query,
            raw: true
        }).then(function (obj) {
            if (obj != null) {
                resolve(obj);
            } else {
                resolve(null);
            }
        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });

}
exports.saveToken = async function (userToken) {
    return new Promise(function (resolve, reject) {
        VnUserToken.create(
            {
                token: userToken.token,
                ip: userToken.ip,
                token_expired_time: userToken.token_expired_time,
                last_login: new Date(),
                user_agent: userToken.user_agent,
                last_login_type: userToken.last_login_type,
                msisdn: userToken.msisdn,
                user_id: userToken.user_id
            }
        ).then(function (user) {
            if (!Utils.isEmpty(user)) {
                resolve(user.dataValues);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('saveToken', err);
            resolve(false);
        });
    });
}
exports.updateToken = function (update, where) {
    return new Promise(function (resolve, reject) {
        VnUserToken.update(
            update,
            {
                where: where,
                raw: true
            }
        ).then(function (video) {
            // console.log('getConfig',configs);
            if (video != null) {
                resolve(video);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('updateItem', err);
            resolve(false);
        });
    });
}