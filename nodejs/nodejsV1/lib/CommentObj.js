const Utils = require('../lib/Utils');
const vnHelper = require('../lib/VnHelper');
const validator = require('validator');
const Obj = require('../lib/Obj');
serialize = function (contents, isLikesArr = [], childComments = [], cache = false) {
    let items = [];
    let parentIds = [];
    if (!Utils.isEmpty(contents) && contents.length > 0) {
        for (let i = 0; i < contents.length; i++) {
            let content = contents[i];
            let objUser = content.u;
            let item = {};
            item.id = content.id;
            item.comment = content.comment;
            item.type = content.type;
            item.parent_id = content.parent_id;
            item.created_at = content.created_at;
            item.like_count = content.like_count;
            //'bucket', 'path', 'full_name', 'msisdn', 'channel_bucket', 'channel_path'
            item.user_id = objUser.id;
            item.bucket = objUser.bucket;
            item.path = objUser.path;
            item.full_name = Utils.isEmpty(objUser.full_name) ? Utils.hideISDNComment(objUser.msisdn) : Utils.truncateWords(objUser.full_name, 20);
            item.msisdn = objUser.msisdn;
            item.channel_bucket = objUser.channel_bucket;
            item.channel_path = objUser.channel_path;
            item.avatarImage = (Utils.isEmpty(objUser.bucket) && Utils.isEmpty(objUser.path)) ? "" : vnHelper.getThumbUrl(objUser.bucket, objUser.path, Obj.SIZE_AVATAR);
            item.coverImage = (Utils.isEmpty(objUser.channel_bucket) && Utils.isEmpty(objUser.channel_path)) ? "" : vnHelper.getThumbUrl(objUser.channel_bucket, objUser.channel_path, Obj.SIZE_COVER);
            item.created_at_format = Utils.timeElapsedString(item.created_at);

            item.is_like = Utils.in_array(content.id, isLikesArr) ? true : false;
            //xu ly du lieu con
            let childNum = 0;
            if (!Utils.isEmpty(childComments) && childComments.length > 0) {
                for (let i = 0; i < childComments.length; i++) {
                    let childComment = childComments[i];
                    let childUser = childComment.u;
                    let child = {};
                    if (item.id == childComment.parent_id) {
                        childNum++;
                        child.is_like = Utils.in_array(childComment.id, isLikesArr) ? true : false;
                        console.log(childUser.msisdn);
                        child.full_name = Utils.isEmpty(childUser.full_name) ? Utils.hideISDNComment(childUser.msisdn) : Utils.truncateWords(childUser.full_name, 20);
                        child.avatarImage = (Utils.isEmpty(childUser.bucket) && Utils.isEmpty(childUser.path)) ? "" : vnHelper.getThumbUrl(childUser.bucket, childUser.path, Obj.SIZE_AVATAR);
                        child.coverImage = (Utils.isEmpty(childUser.channel_bucket) && Utils.isEmpty(childUser.channel_path)) ? "" : vnHelper.getThumbUrl(childUser.channel_bucket, childUser.channel_path, Obj.SIZE_COVER);
                        child.created_at_format = Utils.timeElapsedString(childComment.created_at);
                        item.children = child;
                    }

                }
            }
            item.comment_count = childNum;
            items.push(item);
            parentIds.push(content.id);
        }
        //)

    }
    let arrReturn = {
        content: items,
        parentIds: parentIds,
    };
    return arrReturn;


    // })
}

exports.serialize = serialize;