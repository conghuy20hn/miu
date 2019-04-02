const db = require('.');
const VnPromotionData = require('../models/models_mxhvd/vn_promotion_data');
const obj = VnPromotionData(db.sequelize, db.DataTypes);
const Op = db.sequelize.Op;
exports.VnPromotionData = obj;
checkPromotionData = async function (msisdn) {

    let query = {
        msisdn: msisdn,
        expired_at: {
            [Op.gte]: new Date(), // date('Y-m-d H:i:s')
        }
    };
    return this.checkPromotionQuery(query, "checkPromotionData");

}
exports.checkPromotionData = checkPromotionData;


exports.checkPromotion = function (msisdn) {
    let query = {
        msisdn: msisdn,
        is_active: ACTIVE,
        expired_at: {
            [Op.lt]: new Date(), // date('Y-m-d H:i:s')
        }
    }

    return this.checkPromotionQuery(query, "checkPromotion");
}

exports.checkPromotionQuery = function (query, func = "checkPromotionQuery") {

    return new Promise(function (resolve, reject) {
        obj.findOne({
            where: query,
            raw: true
        }).then(function (promotion) {
            resolve(promotion);
        }).catch(function (e) {
            console.log(func, e);
            resolve(null);
        })
    })

}
