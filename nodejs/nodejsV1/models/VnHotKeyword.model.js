const db = require('.');
const VnHotKeywordBase = require('./models_mxhvd/vn_hot_keyword');
const obj = VnHotKeywordBase(db.sequelize, db.DataTypes);
const utils = require('../lib/Utils');
const ACTIVE = 1;
const IN_ACTIVE = 0;

exports.VnHotKeywordBase = obj;

getActiveKeyword = async function (limit = 10) {
    return new Promise(function (resolve, reject) {
        let where = {
            is_active: ACTIVE,
        };

        let query = obj.findAll({
            where: where,
            order: [
                ['position', 'DESC']
            ],
            limit: limit,
            raw: true
        }).then(function (hotkeys) {
            if (hotkeys != null) {
                resolve(utils.arrayColumn(hotkeys, 'content'));
            } else {
                resolve(null);
            }
        }).catch(function (err) {
            console.log(err);
            resolve(null);
        });
    });

}
exports.getActiveKeyword = getActiveKeyword;