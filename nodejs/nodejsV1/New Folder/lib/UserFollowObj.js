// const db = require('../models');
const Obj = require('../lib/Obj');
// const sequelize = db.sequelize;
const VnHelper = require('../lib/VnHelper');
const Utils = require('../lib/Utils');
const CONFIG = require('../config/config');
const params = require('../config/params');
const VnVideoModel = require('../models/VnVideo.model');

serialize = async function(id, query, cache = false, name = null,appId = 'app-api')
{
    let contents = query;
    let result = [];
    if (!Utils.isEmpty(contents) && contents.length > 0) {
        for (let i = 0; i < contents.length; i++) {
            let content = contents[i];
            let objUser = content.u;
            item = {};
            let videos;
            item.friend_id = content.id;
            item.friend_name = Utils.isEmpty(content.full_name) === false ? content.full_name : content.msisdn;
            item.avatarImage = VnHelper.getThumbUrl(content.bucket, content.path, Obj.SIZE_AVATAR);
            if (id == Obj.USER_FOLLOW_VIDEO) {
                videos = await VnVideoModel.getVideosByUser(Obj.VOD_FILTER, objUser.id, Obj.video_folow_limit, 0);
            } else if (id == Obj.USER_FOLLOW_MUSIC) {
                videos = await VnVideoModel.getVideosByUser(Obj.MUSIC_FILTER, objUser.id, Obj.video_folow_limit, 0);
            } else {
                videos = await VnVideoModel.getVideosByUser(false, objUser.id, Obj.video_folow_limit, 0);
            }

            let tmpVideos = [];
            if (videos) {
                for (let j = 0; j < videos.length; j++) {
                    let video = videos[j];
                    let it = {};
                    it.id = video.id;
                    it.name = video.name;
                    it.coverImage = VnHelper.getThumbUrl(video.bucket, video.path, Obj.SIZE_VIDEO);
                    it.duration = Utils.durationToStr(video.duration);
                    it.slug = video.slug;
                    it.type = 'VOD';
                    tmpVideos.push(it);
                }
            }
            item.videos = tmpVideos;
            result.push(item);
        }

    }
    let arrReturn = {
        id: id,
        name: (name) ? name : Obj.getName(id.toUpperCase()),
        content: result,
        type: 'USER_FOLLOW_VIDEO'
    };
    return arrReturn;
}
exports.serialize = serialize;