const db = require('.');
const VnUserOptBase = require('./models_mxhvd/vn_user_otp');
const VnUserOpt = VnUserOptBase(db.sequelize, db.DataTypes);
const Op = db.sequelize.Op;
const Utils = require('../lib/Utils');

exports.countPerDayByQuery = function (query) {
    return new Promise(function (resolve, reject) {
        var dateFormat = require('dateformat');
        var day = dateFormat(new Date(), "yyyy-mm-dd");
        let startTime = day + " 00:00:00";
        let endTime = day + " 23:59:59";
        query.created_at = {
            [Op.between]: [startTime, endTime]
        }
        VnUserOpt.count(
            {
                where: query,
                raw: true
            }
        ).then(function (num) {
            if (!Utils.isEmpty(num)) {
                resolve(num);
            } else {
                resolve(0);
            }
        }).catch(function (err) {
            console.log('getByContentId', err);
            resolve(0);
        });
    });


}
exports.updateUserOpt = function (update, where) {
    return new Promise(function (resolve, reject) {
        VnUserOpt.update(
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
exports.saveUserOtp = function (item) {
    return new Promise(function (resolve, reject) {
        VnUserOpt.create(
            {
                ip: item.ip,
                expired_time: item.expired_time,
                created_at: new Date(),
                status: 1,
                otp: item.otp,
                msisdn: item.msisdn,
            }

        ).then(function (user) {
            if (!Utils.isEmpty(user)) {
                resolve(user.dataValues);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('saveUserOtp', err);
            resolve(false);
        });
    });
}
exports.checkOTP = function (msisdn, otp) {
    return new Promise(function (resolve, reject) {
        let query = {
            msisdn: msisdn,
            otp: otp,
            status: 1,
            expired_time: {
                $gte: new Date()
            }
        };
        VnUserOpt.findOne(
            {
                where: query,
                raw: true
            }
        ).then(function (objOtp) {
            if (!Utils.isEmpty(objOtp)) {
                resolve(objOtp);
            } else {
                resolve(0);
            }
        }).catch(function (err) {
            console.log('checkOTP', err);
            resolve(0);
        });
    });


}