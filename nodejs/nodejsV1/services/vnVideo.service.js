/**
 * Created by conghuyvn8x on 3/6/2019.
 */
const {VnVideo} = require('../models/VnVideo.model');
const validator = require('validator');
// const {to, TE} = require('../services/util.service');
const ResponseCode = require('../lib/ResponseCode');
const VnConfig = require('../models/vnConfig.model');
const vnVideoEnum = require('../services/lib/vnVideoEnum');
// const utilService = require('../services/util.service');

//const VnVideo = VnVideo.VnVideo;
const VnUser = VnVideo.VnUser;
const Op = VnVideo.Op;

getDetail = function(id, type = "", isObject = false, includeDraft = false){
    return new Promise(function(resolve, reject){
        let where = {
            id: id,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0
        };

        if (includeDraft) {
            where.status = [vnVideoEnum.STATUS_APPROVE, vnVideoEnum.STATUS_DRAFT, vnVideoEnum.STATUS_DELETE];
        } else {
            where.status = vnVideoEnum.STATUS_APPROVE;
        }

        if (type) {
            where.type = type;
        }

        let query = VnVideo.findAll({
            where: where
        }).then(function(vnVideo){
            resolve(vnVideo[0]);
        }).catch(function(err){
            resolve(false);
        });
    })

}

validToggleWatchlate = function(body){
    if(typeof body.id === 'undefined') {
        return ({responseCode: ResponseCode.UNSUCCESS, message : 'ID không hợp lệ',});
    }else{
        let status = (typeof body.status === 'undefined') ? '-1':(body.status.trim());
        if (!validator.isIn(status, [0, 1])) {
            return res.json({responseCode: ResponseCode.UNSUCCESS, message : 'Trạng thái không hợp lệ',});
        }else{
            return true;
        }
    }
}


module.exports.validToggleWatchlate = validToggleWatchlate;
module.exports.getDetail = getDetail;
// module.exports.getFollowUser = getFollowUser;


getVideosByUser = function(filterType = '', userId, limit = 10, offset = 0, type = 'VOD'){
    return new Promise(async function(resolve, reject){
        let where = {
            created_by: userId,
            status: vnVideoEnum.STATUS_APPROVE,
            is_active: vnVideoEnum.ACTIVE,
            is_no_copyright: 0,
            type: type,
            published_time: {
                [Op.lt]: new Date() // date('Y-m-d H:i:s')
                }
            };
            let checkLimit = true;
            switch (filterType) {
                case vnVideoEnum.MUSIC_FILTER:
                    let cfMusic = await VnConfig.getConfig('music.category.list');
                    filterList = trim(cfMusic);
                    //Neu khong cau hinh the loai thi khong tra ve ket qua
                    if (filterList) {
                        where.category_id = filterList.split(',');
                    }else{
                        checkLimit = false;
                    }
                    break;
                case vnVideoEnum.VOD_FILTER:
                    let cfVideo = await VnConfig.getConfig('video.category.list');
                    filterList = trim(cfVideo);
                    if (filterList) {
                        where.category_id = filterList.split(',');
                    } else {
                        checkLimit = false;
                    }
                    break;
            }
            if(checkLimit !== false){
                VnVideo.findAll({
                    where: where,
                    //attributes: ['vn_video.*'],
                    include:{
                        model: VnUser,
                        //attributes: ['vn_user.*'],
                    }
                }).then(function(vnVideo){
                    resolve(vnVideo);
                }).catch(function(err){
                    resolve(false);
                });
            }else{
                resolve({});
            }
        })
}
module.exports.getVideosByUser = getVideosByUser;

