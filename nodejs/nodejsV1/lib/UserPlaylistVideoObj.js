const Utils = require('./Utils');
const vnHelper = require('./VnHelper');
const validator = require('validator');
const VnUserPlaylistItemBase = require('../models/VnUserPlaylistItem.model');
const Obj = require('./Obj');
serialize = async function (id, query, cache = false, name = null, appId = 'app-api') {
    let key = md5(id + "_" + appId + "_" + JSON.stringify(query));
    let contents = [];
    if (params.configStr.cache_enabled == true && cache == true) {
        contents = await redisService.getKey(key, dbredis.constant.dbCache);
        if (Utils.isEmpty(contents)) {
            contents = await VnUserPlaylistItemBase.getPlaylistFindAllQuery(query);


            redisService.setKey(key, JSON.stringify(contents), redis.CACHE_10MINUTE, redis.dbCache);
        } else {
            contents = JSON.parse(contents);

        }
    } else {
        contents = await VnUserPlaylistItemBase.getPlaylistFindAllQuery(query);
    }

    let items = [];
    if (!Utils.isEmpty(contents) && contents.length > 0) {
        for (let i = 0; i < contents.length; i++) {
            let content = contents[i];
            let item = {};
            item.id = content.id;
            item.name = Utils.isEmpty(content.name) ? "" : Utils.truncateWords(content.name, 80);
            item.description = content.description;
            item.num_video = num_video;
            item.coverImage = VnHelper.getThumbUrl(content.bucket, content.path, Obj.SIZE_VIDEO);
            item.type = "USER_PLAYLIST";
            items.push(item);
        }
        //)

    }
    let arrReturn = {
        id: id,
        name: (name) ? name : Obj.getName(id.toUpperCase()),
        content: items,
        type: "USER_PLAYLIST",
    };
    return arrReturn;


    // })
}

exports.serialize = serialize;
