const db = require('.');
const VnFeedBackBase = require('../models/models_mxhvd/vn_feed_back');
const VnFeedBack = VnFeedBackBase(db.sequelize, db.DataTypes);
const Op = db.sequelize.Op;
const Sequelize = require('sequelize');
const Utils = require('../lib/Utils');

exports.VnFeedBackBase = VnFeedBack;

exports.countFeedbackByUserThisDay = async function (userId, msisdn) {
    return new Promise(function (resolve, reject) {
        var dateFormat = require('dateformat');
        var day = dateFormat(new Date(), "yyyy-mm-dd");
        let startTime = day + " 00:00:00";
        let endTime = day + " 23:59:59";
        VnFeedBack.count(
            {
                where: {
                    created_at: {
                        [Op.between]: [startTime, endTime],
                    },
                    [Op.or]: [{ msisdn: msisdn, user_id: userId }]
                },
                 raw: true
            }
        ).then(function (feed) {
            if (!Utils.isEmpty(feed)) {
                resolve(feed);
            } else {
                resolve(0);
            }
        }).catch(function (err) {
            console.log('getByContentId', err);
            resolve(0);
        });
    });

}
exports.saveFeedBack = async function (userId, msisdn, requestType, content, itemId, type) {
    return new Promise(function (resolve, reject) {
        VnFeedBack.create(
            {
                user_id: userId,
                msisdn: msisdn,
                request_type: requestType,
                content: content,
                item_id: itemId,
                type: type,
                updated_at: new Date(),
                created_at: new Date()
            }
        ).then(function (feed) {
            if (!Utils.isEmpty(feed)) {
                resolve(feed.dataValues);
            } else {
                resolve(false);
            }
        }).catch(function (err) {
            console.log('saveFeedBack', err);
            resolve(false);
        });
    });
}