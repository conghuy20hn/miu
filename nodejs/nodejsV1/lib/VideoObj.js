const VnVideoBase = require('../models/VnVideo.model');
const vnVideoEmun = require('../services/lib/vnVideoEnum');
const Obj = require('../lib/Obj');
const VnHelper = require('../lib/VnHelper');
const Utils = require('../lib/Utils');
const CONFIG = require('../config/config');
const params = require('../config/params');

const dbredis = require('../config/redis');
const redis = dbredis.constant;
const redisService = require('../services/redis.service');
var md5 = require('md5');
serialize = async function (id, query, cache = false, name = null, type = null, appId = 'app-api') {
    let key = md5(id + "_" + appId + "_" + JSON.stringify(query));
    let contents = [];
    if (params.configStr.cache_enabled == true && cache == true) {
        contents = await redisService.getKey(key, dbredis.constant.dbCache);
        if (Utils.isEmpty(contents)) {
            contents = await VnVideoBase.getVideosFindAllQuery(query);

            redisService.setKey(key, JSON.stringify(contents), redis.CACHE_10MINUTE, redis.dbCache);
        } else {
            contents = JSON.parse(contents);

        }
    } else {
        contents = await VnVideoBase.getVideosFindAllQuery(query);
    }
    let items = [];

    if (!Utils.isEmpty(contents) && contents.length > 0) {
        for (let i = 0; i < contents.length; i++) {
            let content = contents[i];
            let objUser = content.u;
            let item = {};
            item.id = content.id;
            if (id == Obj.VIDEO_SEARCH) {
                item.name = Utils.truncateWords(content.name, 46);
            } else if (id == Obj.VIDEO_RELATE || id == Obj.VIDEO_RECOMMEND_RELATE) {
                item.name = Utils.truncateWords(content.name, 37);
            } else {
                item.name = Utils.truncateWords(content.name, 70);
            }

            item.fullName = content.name;
            item.description = content.description;
            if (appId == params.configStr.appIdWeb) {
                item.coverImage = VnHelper.getThumbUrl(content.bucket, content.path, Obj.SIZE_VIDEO_WEB_HOME);
                if (id == Obj.VIDEO_HOT_2) {
                    item.coverImage = VnHelper.getThumbUrl(content.bucket, content.path, Obj.SIZE_VIDEO_WEB_HOME, true, true);
                }
                item.animationImage = VnHelper.getThumbAnimationImg(content.file_bucket, content.file_path, Obj.SIZE_VIDEO_WEB_HOME);

            } else {
                item.coverImage = VnHelper.getThumbUrl(content.bucket, content.path, Obj.SIZE_VIDEO);
                if (id == Obj.HOME_VIDEO_V2 || id == Obj.VIDEO_HOT) {
                    item.coverImage = VnHelper.getThumbUrl(content.bucket, content.path, Obj.SIZE_VIDEO, true, true);
                }
                item.animationImage = VnHelper.getThumbAnimationImg(content.file_bucket, content.file_path, Obj.SIZE_VIDEO);

            }

            item.type = Obj.VOD;
            item.duration = Utils.durationToStr(content.duration);
            item.play_times = Utils.convertPlayTimes(content.play_times);
            item.publishedTime = Utils.timeElapsedString(content.publishedTime);
            item.status = content.status;
            item.reason = content.reason;
            item.link = CONFIG.cdnSite + "/video/" + content.id + "/" + content.slug + "?utm_source=APPSHARE";

            item.inkSocial = CONFIG.cdnSite + "/video/" + content.id + "/" + content.slug + "?utm_source=SOCIAL";

            if (!Utils.isEmpty(objUser) && typeof objUser.bucket !== 'undefined' && objUser.bucket != '') {
                item.userAvatarImage = VnHelper.getThumbUrl(content.user_bucket, content.user_path, Obj.SIZE_AVATAR);
            } else {
                let avatarImages = params.randomAvatarChannel;
                let len = avatarImages.length;
                let i = Math.floor(Math.random() * len);
                let randImage = avatarImages[i];
                content.user_bucket = randImage["bucket"];
                content.user_path = randImage["path"];
                item.userAvatarImage = VnHelper.getThumbUrl(content.user_bucket, content.user_path, Obj.SIZE_AVATAR);
            }
            if (!Utils.isEmpty(objUser) && typeof objUser.user_id !== 'undefined' && objUser.user_id != '') {
                item.user_id = objUser.user_id; // Obj.getThumbUrl(content.user_bucket, content.user_path, Obj.SIZE_AVATAR);
            }
            if (!Utils.isEmpty(objUser) && typeof objUser.full_name !== 'undefined' && typeof objUser.msisdn !== 'undefined') {
                item.fullUserName = objUser.full_name ? objUser.full_name : objUser.msisdn;
                item.userName = Utils.truncateWords(item.fullUserName, 15); // Obj.getThumbUrl(content.user_bucket, content.user_path, Obj.SIZE_AVATAR);
                item.msisdn = (Utils.isEmpty(objUser.msisdn)) ? "" : Utils.hideMsisdn(objUser.msisdn);
            }

            if (appId == params.configStr.appIdApi || appId == params.configStr.appIdWap) {
                item.slug = content.slug;
            }
            //Neu video bi tu choi status =3 and co feedback
            if (content.status == vnVideoEmun.STATUS_DELETE && Utils.isset(content.feedback_status)) {
                item.feedback_status = content.feedback_status;
                item.feedback_reject_reason = content.feedback_reject_reason;
            }
            items.push(item);
        }

    }
    let arrReturn = {
        id: id,
        name: (name) ? name : Obj.getName(id.toUpperCase()),
        content: items,
        type: Utils.isset(type) ? type : Obj.VOD,
    };
    return arrReturn;

}

exports.serialize = serialize;