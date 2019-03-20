
const vnPromotion = require('../models/VnPromotionData.model');
const vnSub = require('../models/VnSub.model');
const redis = require('../config/redis');
const params = require('../config/params');
const redisService = require('../services/redis.service');
const obj = require('../lib/Obj');
const utils = require('../lib/Utils');
const config = require('../models/config.model');
/**
 * dungld
 * Tra ve popup
 * @param msisdn
 */
exports.loadPromotionPopup = async function (msisdn, isLoadFirst = false) {
    if (!msisdn) {
        return [];
    }

    promotion = await vnPromotion.checkPromotionData(msisdn);
    if (promotion != null) {

        // check msisdn exits sub
        objSub = await vnSub.getOneSubByMsisdn(msisdn);
        //if exits sub then not display popup
        if ($objSub) {
            return [];
        }
        let key = obj.promotion_ + msisdn;
        let hasInRedis = redisService.getKey(key, redis.dbCache);

        //check key redis
        var keyPopup = obj.promotion_popup_firsttime;
        if (isLoadFirst) {
            keyPopup = obj.promotion_popup_firsttime;
        } else if ($hasInRedis) {
            keyPopup = promotion.popup;
        } else {
            keyPopup = obj.promotion_popup_firsttime;
            redisService.setKey(key, utils.getCurrentTime("yyyy-mm-dd HH:MM:ss"), redis.CACHE_10MINUTE, dbRedis);
        }

        if (keyPopup) {
           let arrReplace = [];
           arrReplace.MSISDN = utils.getMobileNumber(msisdn, params.configStr.MOBILESIMPLE);
           arrReplace.EXPIREDAT = utils.converDate(promotion.expired_at, "dd/MM/yyyy HH:MM:ss");
            return {
                popupId: keyPopup,
                popupMessage: str_replace(array_keys($arrReplace), array_values($arrReplace), config.getConfigKey(keyPopup, ""))
            };
        } else {
            return null;
        }
    } else {
        return null;
    }
}