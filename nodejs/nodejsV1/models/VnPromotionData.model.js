const db = require('.');
const VnPromotionData = require('../models/models_mxhvd/vn_promotion_data');
const obj = VnPromotionData(db.sequelize, db.DataTypes);
const Op = db.sequelize.Op;
exports.VnPromotionData = obj;
checkPromotionData = async function (msisdn) {
    return new Promise(function (resolve, reject) {
        let where = {
            msisdn: msisdn,
            expired_at: {
                [Op.gte]: new Date(), // date('Y-m-d H:i:s')
            }
        };
        let query = obj.findOne({
            where: where
        }).then(function (promotion) {
            if (promotion != null) {
                let obj = promotion.dataValues;
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
exports.checkPromotionData = checkPromotionData;


checkPromotion = function(msisdn){
    return new Promise(function(resolve, reject){
        obj.findOne({
            where: {
                msisdn: msisdn,
                is_active: ACTIVE,
                expired_at: {
                    [Op.lt]: new Date(), // date('Y-m-d H:i:s')
                }
            }
        }).then(function(promotion){
            // console.log(playlist.dataValues);
            resolve(promotion);
        }).catch(function(e){
            console.log(e);
            resolve(false);
        })
    })
}

exports.checkPromotion = checkPromotion;