const db = require('.');
const VnSmsMtBase = require('./models_mxhvd/vn_sms_mt');
const VnSmsMt = VnSmsMtBase(db.sequelize, db.DataTypes);
const VnConfigBase = require('./config.model');
const Utils = require('../lib/Utils');
exports.saveSmsMt = async function (item) {
    let shortCode = await VnConfigBase.getConfigKey('SHORTCODE');
    console.log(shortCode);
    return new Promise(function (resolve, reject) {
        VnSmsMt.create(
            {
                mo_his_id: 0,
                msisdn: item.msisdn,
                message: item.content,
                receive_time: new Date(),
                channel: shortCode
            }

        ).then(function (user) {
            if (!Utils.isEmpty(user)) {
                resolve(user.dataValues);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('saveSmsMt', err);
            resolve(false);
        });
    });
}