/**
*@author: dungld
*@createdAt: 2019-03-09 21:44:33
*/
const db = require('../models');
const VnSub = require('../models/models_mxhvd/vn_sub');
const VnPackage = require('../models/models_mxhvd/vn_package')(db.sequelize, db.DataTypes);
const obj = VnSub(db.sequelize, db.DataTypes);
// VnSub.belongsTo(obj, {foreignKey: 'package_id', as: 'p'});

const Op = db.sequelize.Op;

const STATUS_ACTIVE = 1;

exports.VnSub = obj;
getOneSubByMsisdn = function (msisdn) {
    return new Promise(function (resolve, reject) {
        obj.findOne({
            where: {
                msisdn: msisdn,
                stauts: STATUS_ACTIVE,
            },
            include: {
                mode: VnPackage, as: 'p',
                attribute: ['quota_views', 'name', 'distribution_id', 'fee']
            },
            raw: true
        }).then(function (subs) {
            resolve(subs);
        }).catch(function (e) {
            console.log("getOneSubByMsisdn", e);
            resolve(false);
        })
    })
}
exports.getOneSubByMsisdn = getOneSubByMsisdn;

getSub = async function (msisdn) {
    return new Promise(function (resolve, reject) {
        let where = {
            msisdn: msisdn,
            status: STATUS_ACTIVE
        };
        obj.findAll({
            where: where
        }).then(function (sub) {
            if (promotion != null) {
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
exports.getSub = getSub;
