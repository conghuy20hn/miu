const db = require('../models');
const VnGroupCategoryBase = require('../models/VnGroupCategory.model');
const Obj = require('../lib/Obj');
const params = require('../config/params');
var md5 = require('md5');
const Utils = require('../lib/Utils');
const vnHelper = require('../lib/VnHelper');
const config = require('../models/config.model');
const dbredis = require('../config/redis');
const redis = dbredis.constant;
const redisService = require('../services/redis.service');

serialize = async function (id, query, cache = false, appId = params.configStr.appIdApi) {
    let key = md5(id + "_" + appId + "_" + JSON.stringify(query));
    let contents = [];
    if (params.configStr.cache_enabled == true && cache == true) {
        contents = await redisService.getKey(key, dbredis.constant.dbCache);
        if (Utils.isEmpty(contents)) {
            contents = await VnGroupCategoryBase.getFindAllQuery(query);

            redisService.setKey(key, JSON.stringify(contents), redis.CACHE_10MINUTE, redis.dbCache);
        } else {
            contents = JSON.parse(contents);

        }
    } else {
        contents = await VnGroupCategoryBase.getFindAllQuery(query);
    }
    let items = [];
    if (contents.length > 0) {
        //let arrReturn = await getListVideo(contents, id);
        for (let i = 0; i < contents.length; i++) {
            let content = contents[i];
            let item = {};
            item.id = content.id;
            item.name = content.name;

            item.name_short = Utils.truncateWords(content.name, 15, true);
            item.description = content.description;
            item.coverImage = vnHelper.getThumbUrl(content.bucket, content.path, Obj.SIZE_CATEGORY);
            if (appId == 'app-web' && id != Obj.CATEGORY_PARENT) {
                item.avatarImage = vnHelper.getThumbUrl(content.avatar_bucket, content.avatar_path, Obj.SIZE_CHANNEL_LOGO_LIST);
            } else {
                item.avatarImage = vnHelper.getThumbUrl(content.avatar_bucket, content.avatar_path, Obj.SIZE_AVATAR);
            }

            item.avatarImageHX = vnHelper.getThumbUrl(content.avatar_bucket, content.avatar_path, Obj.SIZE_AVATAR);

            item.slug = content.slug;
            item.type = content.type;
            item.play_times = Utils.number_format(content.play_times, 0, ',', '.');
            //Them highlight event 20/10
            item.is_event = (item.id == await config.getConfigKey("event.2010.id")) ? 1 : 0;
            items.push(item);
        }
        //)

    }
    let arrReturn = {
        id: id,
        name: Obj.getName(id.toUpperCase()),
        content: items,
        type: Obj.CATEGORY,
    };
    return arrReturn;


    // })
}

exports.serialize = serialize;