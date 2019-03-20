const Utils = require('./Utils');
const vnHelper = require('./VnHelper');
const validator = require('validator');
const Obj = require('./Obj');
serialize = function (id, contents, limit = 10, cache = false, name = null) {
    let items = [];
    if (!Utils.isEmpty(contents) && contents.length > 0) {
        for (let i = 0; i < contents.length; i++) {
            let content = contents[i];
            let item = {};
            item.channel_id = content.id;
            item.channel_name = Utils.isEmpty(content.full_name) ? Utils.hideISDNComment(content.msisdn) : Utils.truncateWords(content.full_name, 80);
            item.channel_name_mini = Utils.isEmpty(content.full_name) ? Utils.hideISDNComment(content.msisdn) : Utils.truncateWords(content.full_name, 30);


            if (!Utils.isEmpty(content) && typeof content.bucket !== 'undefined' && content.bucket != '') {
                let avatarImages = params.randomAvatarChannel;
                let len = avatarImages.length;
                let i = Math.floor(Math.random() * len);
                let randImage = avatarImages[i];
                content.user_bucket = randImage["bucket"];
                content.user_path = randImage["path"];
            }
            if (!Utils.isEmpty(content) && typeof content.bucket !== 'undefined' && content.bucket != '') {
                let avatarImages = params.randomBannerChannel;
                let len = avatarImages.length;
                let len = avatarImages.length;
                let i = Math.floor(Math.random() * len);
                let randImage = avatarImages[i];
                content.channel_bucket = randImage["bucket"];
                content.channel_path = randImage["path"];
            }

            item.avatarImage = VnHelper.getThumbUrl(content.bucket, content.path, Obj.SIZE_AVATAR);
            item.avatarImageH = VnHelper.getThumbUrl(content.bucket, content.path, Obj.SIZE_CHANNEL_LOGO_DETAIL);
            item.avatarImageHX = VnHelper.getThumbUrl(content.bucket, content.path, Obj.SIZE_AVATAR);
            item.coverImage = VnHelper.getThumbUrl(content.bucket, content.path, Obj.SIZE_COVER);



            item.num_follow = content.follow_count;
            item.num_video = content.video_count;
            item.description = content.description;
            if (!Utils.isEmpty(content.is_follow)) {
                item.isFollow = true;
            }
            if (content.follow_id > 0) {
                item.isFollow = true;
            }
            items.push(item);
        }
        //)

    }
    let arrReturn = {
        id: id,
        name: (name) ? name : Obj.getName(id.toUpperCase()),
        content: items,
        type: Utils.isset(type) ? type : Obj.VOD,
    };
    return arrReturn;


    // })
}

exports.serialize = serialize;