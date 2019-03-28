const Utils = require('./Utils');
const vnHelper = require('./VnHelper');
const validator = require('validator');
const Obj = require('./Obj');
serialize = function (id, contents, cache = false, name = null) {
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