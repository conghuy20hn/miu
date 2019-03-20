const db = require('../models');
const VtConfigBase = require('../models/config.model');
const Obj = require('../lib/Obj');
const params = require('../config/params');
const sequelize = db.sequelize;
var md5 = require('md5');
const utils = require('../lib/Utils');
const vnHelper = require('../lib/VnHelper');
const config = require('../models/config.model');
serialize = function (id, query, cache = false, appId = 'app-api') {

    let key = id + "_" + appId + "_" + md5(query.toString());
    if (params.configStr.cache_enabled == true) {

    } else {

    }
    // return new Promise(async function (resolve, reject) {
    let contents = query;
    let items = [];
    if (contents.length > 0) {
        //let arrReturn = await getListVideo(contents, id);

        for (let i = 0; i < contents.length; i++) {
            let content = contents[i];
            let item = {};
            item.id = content.id;
            item.name = content.name;

            item.name_short = utils.truncateWords(content.name, 15, true);
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
            item.play_times = utils.number_format(content.play_times, 0, ',', '.');
            //Them highlight event 20/10
            item.is_event = (item.id == config.getConfigKey("event.2010.id")) ? 1 : 0;
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